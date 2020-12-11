import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';

const HELP = [
    "next turn for simulation",
    "--turn=10 || $ run 10"
];

export default function runTurn(controller: Controller, ...args: string[]): string[] {
    // Describe the current map
    let kvps = argparse(args);
    let turns = 1;
    if (kvps.length) {
        if (kvps[0].key == "help") {
            return HELP;
        }
        if (kvps[0].key == "turn") {
            turns = parseInt(kvps[0].value);
        }
        if (parseInt(kvps[0].key) !== NaN) {
            turns = parseInt(kvps[0].key);
        }
    }
    turns = turns > 20 ? 20 : (turns < 1) ? 1 : turns;
    let result = [`ran ${turns} turn${ turns > 1 ? "s" : ""}`]; 
    while (turns > 0) {
        controller.runTurn();
        turns--;
    }
    return result.concat(basicReporting(controller));
}

function basicReporting(controller: Controller): string[] {
    let sim = controller.simulation;
    let result = [];
    result.push(`TURN ${sim.turn}`);
    result.push(`${sim.households.size} households`);
    result.push(`${sim.people.size} people`);
    return result;
}
