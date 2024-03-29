// This is separated from household.ts due to it being too long.
// This concern the atomic business of households
// getting the things that are just 'nice to have'
import { Household } from '../household';
import { ResourceType } from '../properties/resourceTypes';


export default function getHouseholdSpending(hh: Household): void {
    let spare = meetsCriteria(hh);
    // Housing and Service is nice to have.
    if (!hh.isSingle) {
        if (hh.storage.getResource(ResourceType.Haus) < 10) {
            hh.projectedConsumption[ResourceType.Haus] = spare ? 3 : 1;
        } else {
            let demand = spare ? 0.1 * hh.storage.getResource(ResourceType.Haus): 0;
            hh.projectedConsumption[ResourceType.Haus] = demand;
        }
    }
    if (hh.storage.getResource(ResourceType.Haus) > 5 && spare) {
        let demand = hh.storage.getResource(ResourceType.Haus) * 0.2;
        demand = demand > 30 ? 30 : demand;
        hh.projectedConsumption[ResourceType.Serv] = demand;
    }
}


function meetsCriteria(hh: Household): boolean {
    if (hh.storage.getResource(ResourceType.Food) > 2 * hh.projectedConsumption[ResourceType.Food]) {
        // has enough food
        return true;
    }
    let foodOrders = hh.orders.filter(o => o.resourceName == ResourceType.Food);
    if (foodOrders.some(o => !o.orderType)) {
        // was just selling food
        return true;
    }
    if (foodOrders.length) {
        let order = foodOrders[0];
        if (order.delivered) {
            let price = order.settlePrice;
            if (hh.storage.gold > order.settlePrice * hh.projectedConsumption[ResourceType.Food] * 2) {
                return true;
            }
        }
    }
    return false;
}
