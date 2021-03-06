import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { cmdprint } from '../util';

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
    if (Number.isNaN(turns)) {
        return ["Turns must be numbers"];
    } else if (turns < 0) {
        return ["Turns must be positive"]
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
    if (sim.people.size > 3500 && controller.mapCanvas.mode == "DEFAULT") {
        result.push(`tip: this amount of people might be hard to see, try:`);
        result.push(`${cmdprint("mode city")} or ${cmdprint("mode density")}`);
    }
    return result;
}
