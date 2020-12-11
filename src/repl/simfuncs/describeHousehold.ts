import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { Household } from '../../sim/people/household';
import { Simulation } from '../../sim/sim';

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
        result.push(`${p.getName()}, age: ${p.age}, health: ${Math.floor(p.health)}`);
    });
    if (household.dependents.length) {
        result.push('------ CHILDREN ------');
        household.dependents.forEach(p => {
            result.push(`${p.getName()}, age: ${p.age}, health: ${Math.floor(p.health)}`);
        });
    }
    result.push('------ STORAGE ------');
    Object.entries(household.storage.storage).forEach(entry => {
        const [key, val] = entry;
        result.push(`${key}: ${Math.floor(val * 100)/100}`);
    });
    return result;
}
