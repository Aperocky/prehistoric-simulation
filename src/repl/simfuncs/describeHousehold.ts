import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { Household } from '../../sim/people/household';
import { Person } from '../../sim/people/person';
import { Simulation } from '../../sim/sim';
import { WORK_TYPES } from '../../sim/people/work/workTypes';
import { roundTo, cmdprint, describeIncome, createTable, describeStorage } from '../util';


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
        return describe(controller, controller.simulation.households.get(hhid));
    } else {
        return [`Cannot find household with id of ${hhid}`]
    }
}


function describe(controller: Controller, household: Household): string[] {
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
    result.push(`location: ${cmdprint(`square x=${household.location.x} y=${household.location.y}`)}`);
    let fam = [].concat(...[household.adults, household.dependents]);
    result.push(...describeFamilyMember(fam, controller));
    result.push(...describeStorage([household]));
    result.push(...describeConsumption(household));
    result.push(...describeIncome(fam));
    result.push(...describeOrders(household));
    return result;
}


function describeFamilyMember(members: Person[], controller: Controller): string[] {
    let title = "MEMBERS"
    let header = ["INDEX", "NAME", "GENDER", "AGE", "HEALTH", "WORK"]
    let rows: string[][] = [];
    controller.replTerminal.memcmds = [];
    members.forEach((p, i) => {
        rows.push([
            (i).toString(),
            p.getName(),
            p.heritage.gender == 0 ? "FEMALE" : "MALE",
            p.age.toString(),
            roundTo(p.health, 0).toString(),
            p.age > 10 ? WORK_TYPES[p.work.work].name : "Child",
        ]);
        controller.replTerminal.memcmds.push(`pp --id=${p.id}`);
    });
    let table = createTable(title, header, rows);
    table.push(`use ${cmdprint('mem $index')} to inspect individual rows`);
    return table;
}


function describeConsumption(hh: Household): string[] {
    let title = "CONSUMPTION"
    let header = ["RESOURCE", "DESIRED", "ACTUAL"]
    let rows: string[][] = [];
    Object.entries(hh.projectedConsumption).forEach(entry => {
        const [key, val] = entry;
        rows.push([
            key.toUpperCase(),
            roundTo(val).toString(),
            roundTo(val * hh.percentSatisfied[key]).toString()
        ]);
    });
    return createTable(title, header, rows);
}


function describeOrders(hh: Household): string[] {
    let title = "ORDERS"
    let header = ["TYPE", "RESOURCE", "QUANTITY", "OFFER", "DELIVERD", "ACTUAL"]
    let rows: string[][] = [];
    if (hh.orders.length) {
        hh.orders.forEach(order => {
            rows.push([
                order.orderType ? "BUY": "SELL",
                order.resourceName.toUpperCase(),
                roundTo(order.quantity).toString(),
                roundTo(order.unitPrice * order.quantity, 4).toString(),
                order.delivered.toString(),
                order.delivered ? `${roundTo(order.settlePrice * order.quantityFulfilled, 4)}` : "-"
            ]);
        });
        return createTable(title, header, rows);
    }
    return [];
}
