import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { Person } from '../../sim/people/person';
import { Simulation } from '../../sim/sim';
import { WORK_TYPES } from '../../sim/people/work/workTypes';
import { roundTo, cmdprint } from '../util';

const HELP = [
    "describe personal information",
    "pp id=PERSON_ID",
];

export default function describePerson(controller: Controller, ...args: string[]): string[] {
    let kvps = argparse(args);
    let ppid = "";
    if (kvps.length) {
        if (kvps[0].key == "help") {
            return HELP;
        }
        if (kvps[0].key == "id") {
            ppid = kvps[0].value;
        }
    }
    if (!(ppid)) {
        return ["id argument is required"];
    }
    if (controller.simulation.people.has(ppid)) {
        return describe(controller.simulation, controller.simulation.people.get(ppid));
    } else {
        return [`Cannot find person with id of ${ppid}`]
    }
}

function describe(sim: Simulation, person: Person): string[] {
    let result = [];
    let workstr = WORK_TYPES[person.work.work].name;
    if (person.age < 10) {
        workstr = "Child";
    }
    result.push(`${workstr} ${person.getName()}`);
    result.push(`AGE: ${person.age}`);
    result.push(`HEALTH: ${person.health}`);
    result.push(`produce: ${roundTo(person.work.produce)} ${WORK_TYPES[person.work.work].produceType}`);
    result.push('-------- FAMILY --------');
    result.push(`HOUSEHOLD: ${cmdprint(`hh --id=${person.household.id}`)}`);
    result.push(`MOTHER: ${cmdprint(`pp --id=${person.heritage.mother}`)}`);
    result.push(`FATHER: ${cmdprint(`pp --id=${person.heritage.father}`)}`);
    if (person.heritage.children.length) {
        person.heritage.children.forEach(c => {
            result.push(`CHILD: ${cmdprint(`pp --id=${c}`)}`);
        });
    }
    return result;
}
