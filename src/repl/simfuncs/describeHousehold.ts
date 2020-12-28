import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { Household } from '../../sim/people/household';
import { Simulation } from '../../sim/sim';
import { WORK_TYPES } from '../../sim/people/work/workTypes';
import { roundTo, cmdprint, describeProduction } from '../util';

const HELP = [
    "describe household information",
    "hh id=HOUSEHOLD_ID",
    "hover over household to activate",
];

export default function describeHousehold(controller: Controller, ...args: string[]): string[] {
    let kvps = argparse(args);
    let hhid = "";
    if (kvps.length) {
        if (kvps[0].key == "help") {
            return HELP;
        }
        if (kvps[0].key == "id") {
            hhid = kvps[0].value;
        }
    }
    if (!(hhid)) {
        return ["id argument is required"];
    }
    if (controller.simulation.households.has(hhid)) {
        return describe(controller.simulation, controller.simulation.households.get(hhid));
    } else {
        return [`Cannot find household with id of ${hhid}`]
    }
}

function describe(sim: Simulation, household: Household): string[] {
    let result = [];
    if (household.isSingle) {
        if (household.dependents.length) {
            result.push(`Household of widower ${household.adults[0].getName()}`);
        } else {
            result.push(`Single ${household.adults[0].heritage.gender ? "Man" : "Woman"} ${household.adults[0].getName()}`);
        }
    } else {
        result.push(`Family of ${household.adults[0].heritage.surname}`);
    }
    result.push(`@ x=${household.location.x} y=${household.location.y}`);
    result.push('------- ADULTS -------');
    household.adults.forEach(p => {
        let workstr = WORK_TYPES[p.work.work].name;
        result.push(`${workstr} ${p.getName()}, age: ${p.age}, health: ${Math.floor(p.health)}`);
        result.push(cmdprint(`pp --id=${p.id}`));
    });
    if (household.dependents.length) {
        result.push('------ CHILDREN ------');
        household.dependents.forEach(p => {
            let workstr = p.age > 10 ? WORK_TYPES[p.work.work].name : "Child";
            result.push(`${workstr} ${p.getName()}, age: ${p.age}, health: ${Math.floor(p.health)}`);
            result.push(cmdprint(`pp --id=${p.id}`));
        });
    }
    result.push('------ STORAGE ------');
    Object.entries(household.storage.storage).forEach(entry => {
        const [key, val] = entry;
        result.push(`${key}: ${roundTo(val)}`);
    });
    result.push(`GOLD: ${roundTo(household.storage.gold)}`);
    result.push('---- CONSUMPTION ----');
    Object.entries(household.projectedConsumption).forEach(entry => {
        const [key, val] = entry;
        result.push(`${key}: desired: ${roundTo(val)}, actual: ${roundTo(val * household.percentSatisfied[key])}`);
    });
    result.push('---- PRODUCTION ----');
    let fam = [].concat(...[household.adults, household.dependents]);
    result.push(...describeProduction(fam));
    result.push(...describeOrders(household));
    return result;
}

function describeOrders(hh: Household): string[] {
    if (hh.orders.length) {
        let result = [];
        hh.orders.forEach(order => {
            let orderType = order.orderType ? "-BUY" : "SELL";
            let priceStr = order.delivered
                    ? `FINAL PRICE: ${roundTo(order.settlePrice * order.quantity, 4)}`
                    : "";
            result.push(`---${orderType} ORDER: ${order.resourceType.toUpperCase()} ----`);
            result.push(`QUANTITY: ${roundTo(order.quantity)}  OFFER: ${roundTo(order.amount, 4)}`)
            result.push(`DELIVERED: ${order.delivered} ${priceStr}`);
        });
        return result;
    }
    return [];
}
