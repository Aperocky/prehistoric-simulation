import { Household } from '../household';
import { Order } from '../../market/order';
import { ResourceType } from '../properties/resourceTypes';


export default function shop(hh: Household): Order[] {
    // This function is expected to be ran when
    // 1. Projected consumption is populated.
    // 2. Current year production is registered in storage.
    // It should return:
    // 1. Orders to the market.
    // 2. Supplies to the market.
    let currentSupplies: {[resourceType: string]: number} = {};
    for (const [key, val] of Object.entries(hh.projectedConsumption)) {
        if (val === 0) {
            continue;
        }
        if (key == ResourceType.Haus) {
            // Bypass storage for housing as it's non-consumable
            currentSupplies[key] = 0;
            continue;
        }
        let currentAmount = hh.storage.getResource(key);
        currentSupplies[key] = currentAmount/val;
    }
    let avgHealth = hh.adults.reduce((sum, person) => person.health + sum, 0)/hh.adults.length;
    let riskAcceptance = 1 + avgHealth/(1 + hh.dependents.length);
    let safetyMargin = 100/riskAcceptance;
    safetyMargin = safetyMargin < 1.5 ? 1.5 : safetyMargin; // Edge case
    safetyMargin = safetyMargin > 4 ? 4 : safetyMargin; // Cap.
    let orders = sell(currentSupplies, hh, riskAcceptance, safetyMargin);
    orders.push(...buy(currentSupplies, hh, riskAcceptance, safetyMargin));
    return orders;
}


function buy(currentSupplies: {[resourceType: string]: number},
             hh: Household,
             riskAcceptance: number,
             safetyMargin: number): Order[] {
    if (hh.storage.gold === 0) {
        return [];
    }
    let orders = [];
    // Potential hunger situation
    if (currentSupplies[ResourceType.Food] < 1) {
        let quantity = hh.projectedConsumption[ResourceType.Food]
                - hh.storage.getResource(ResourceType.Food);
        let riskFactor = 25/riskAcceptance;
        riskFactor = riskFactor > 1 ? 1 : riskFactor;
        let amount = hh.storage.gold * riskFactor;
        orders.push(hh.createMarketOrder(ResourceType.Food, quantity, amount, true));
    }
    if (hh.storage.gold === 0) {
        return orders;
    }

    // Store up on food
    if (currentSupplies[ResourceType.Food] < safetyMargin) {
        let currentMargin = currentSupplies[ResourceType.Food] > 1 ? currentSupplies[ResourceType.Food] : 1;
        let quantity = (safetyMargin - currentMargin) * hh.projectedConsumption[ResourceType.Food];
        let riskFactor = 10/riskAcceptance; // Not urgent
        riskFactor = riskFactor > 0.5 ? 0.5 : riskFactor;
        let amount = hh.storage.gold * riskFactor * (safetyMargin - currentMargin);
        if (quantity > 0) {
            orders.push(hh.createMarketOrder(ResourceType.Food, quantity, amount, true));
        }
    }
    if (hh.storage.gold === 0) {
        return orders;
    }

    // Other resources.
    for (const [key, val] of Object.entries(currentSupplies)) {
        if (key == ResourceType.Food) {
            continue;
        }
        if (currentSupplies[key] < safetyMargin) {
            let quantity = (safetyMargin - currentSupplies[key]) * hh.projectedConsumption[key];
            let riskFactor = riskAcceptance/200; // Risky types likes to buy other things
            riskFactor = riskFactor > 0.5 ? 0.5 : riskFactor;
            let amount = hh.storage.gold * riskFactor * (safetyMargin - currentSupplies[key]);
            if (quantity > 0 && amount > 0) {
                orders.push(hh.createMarketOrder(key, quantity, amount, true));
            }
        }
    }
    return orders;
}


function sell(currentSupplies: {[resourceType: string]: number},
             hh: Household,
             riskAcceptance: number,
             safetyMargin: number): Order[] {
    let orders = [];
    for (const [key, val] of Object.entries(currentSupplies)) {
        if (currentSupplies[key] > safetyMargin) {
            let quantity = (currentSupplies[key] - safetyMargin) * hh.projectedConsumption[key];
            if (key == ResourceType.Haus) {
                if (hh.adults[0].isHungry()) {
                    quantity = val * 0.5;
                } else if (currentSupplies[ResourceType.Food] < 1) {
                    quantity = val * 0.2;
                } else {
                    continue;
                }
            }
            let riskFactor = riskAcceptance/400; // Risky type sells for higher prices.
            let amount = hh.storage.gold * riskFactor * (currentSupplies[key] - safetyMargin);
            if (amount < 0.001) {
                amount = 0.001; // minimum amount;
            }
            if (quantity > 0) {
                orders.push(hh.createMarketOrder(key, quantity, amount, false));
            }
        }
    }

    for (const [key, val] of Object.entries(hh.storage.storage)) {
        if (!(key in currentSupplies)) {
            // Sell everything except house, and house too if too hungry
            let quantity = val;
            let riskFactor = riskAcceptance/400;
            let amount = hh.storage.gold * riskFactor
            if (key == ResourceType.Haus) {
                if (hh.adults[0].isHungry()) {
                    quantity = val * 0.5;
                } else if (currentSupplies[ResourceType.Food] < 1) {
                    quantity = val * 0.2;
                } else {
                    continue;
                }
            }
            if (amount < 0.001) {
                amount = 0.001; // minimum amount;
            }
            if (quantity > 0) {
                orders.push(hh.createMarketOrder(key, quantity, amount, false));
            }
        }
    }
    return orders;
}
