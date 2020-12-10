import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';

const HELP = [
    "next turn for simulation",
];

export default function runTurn(controller: Controller, ...args: string[]): string[] {
    // Describe the current map
    let kvps = argparse(args);
    if (kvps.length) {
        if (kvps[0].key == "help") {
            return HELP;
        }
    }
    controller.runTurn();
    return ["RAN TURN"];
}
