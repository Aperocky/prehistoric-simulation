import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { Person } from '../../sim/people/person';
import { Simulation } from '../../sim/sim';
import { WORK_TYPES } from '../../sim/people/work/workTypes';
import { roundTo, cmdprint, createTable } from '../util';

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
    result.push(`HOUSEHOLD: ${cmdprint(`hh --id=${person.household.id}`)}`);
    result.push(...personTable(person));
    result.push(...heritageTable(sim, person));
    return result;
}

function personTable(person: Person): string[] {
    let workstr = WORK_TYPES[person.work.work].name;
    if (person.age < 10) {
        workstr = "Child";
    }
    let title = person.getName();
    let header = ["ATTRIBUTE", "VALUE"];
    let rows: string[][] = [];
    rows.push(["AGE", person.age.toString()]);
    rows.push(["HEALTH", roundTo(person.health, 0).toString()]);
    rows.push(["JOB", workstr]);
    rows.push(["PRODUCE", `${roundTo(person.work.produce)} ${WORK_TYPES[person.work.work].produceType}`]);
    return createTable(title, header, rows);
}

function heritageTable(sim: Simulation, person: Person): string[] {
    let getPerson = (sim: Simulation, id: string): Person | null => {
        if (sim.people.has(id)) {
            return sim.people.get(id);
        }
        return null;
    }
    let title = "HERITAGE";
    let header = ["INDEX", "RELATIONSHIP", "ALIVE", "NAME"];
    let rows: string[][] = [];
    let cmds: string[] = [];
    let mother = getPerson(sim, person.heritage.mother);
    let father = getPerson(sim, person.heritage.father);
    rows.push(["1", "MOTHER", mother ? "YES" : "NO", mother ? mother.getName() : "-"]);
    rows.push(["2", "FATHER", father ? "YES" : "NO", father ? father.getName() : "-"]);
    if (mother) cmds.push(`1: ${cmdprint(`pp --id=${mother.id}`)}`);
    if (father) cmds.push(`2: ${cmdprint(`pp --id=${father.id}`)}`);
    if (person.heritage.children.length) {
        person.heritage.children.forEach((c, i) => {
            let child = getPerson(sim, c);
            rows.push([(i + 3).toString(), "CHILD", child ? "YES" : "NO", child ? child.getName() : "-"]);
            if (child) cmds.push(`${i+3}, ${cmdprint(`pp --id=${child.id}`)}`);
        });
    }
    return createTable(title, header, rows).concat(cmds);
}
