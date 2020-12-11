import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { Household } from '../../sim/people/household';
import { Simulation } from '../../sim/sim';

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
    let totalAge = 0;
    let totalHealth = 0;
    let female = 0;
    let single = 0;
    sim.people.forEach(p => {
        totalAge += p.age;
        totalHealth += p.health;
        female += p.heritage.gender ? 0 : 1;
    });
    sim.households.forEach(hh => {
        single += hh.isSingle ? 1 : 0;
    })
    result.push(`Simulation at year ${sim.turn}`);
    result.push("------------------------");
    result.push(`${sim.households.size} households`);
    result.push(`${sim.people.size} people`);
    result.push(`Average age: ${Math.floor(totalAge/sim.people.size * 100)/100}`);
    result.push(`Average health: ${Math.floor(totalHealth/sim.people.size * 100)/100}`);
    result.push(`Female: ${female} Male: ${sim.people.size - female}`);
    result.push(`Single households: ${single}`);
    return result;
}
