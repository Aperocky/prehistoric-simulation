import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { Household } from '../../sim/people/household';
import { Simulation } from '../../sim/sim';
import { describePeople, describeIncome } from '../util';

const HELP = [
    "describe simulation information",
];

export default function describeSimulation(controller: Controller, ...args: string[]): string[] {
    let kvps = argparse(args);
    if (kvps.length) {
        if (kvps[0].key == "help") {
            return HELP;
        }
    }
    return describeSim(controller.simulation);
}

function describeSim(sim: Simulation): string[] {
    let result = [];
    result.push(`Simulation at year ${sim.turn}`);
    result.push(...describePeople(Array.from(sim.households.values()), Array.from(sim.people.values())));
    result.push(...describeIncome(Array.from(sim.people.values())));
    return result;
}
