import { Controller } from '../../controller';
import { argparse, KeyValue } from './util';

const HELP = [
    "regenerate command will regenerate the map"
];

export default function regenerateMap(controller: Controller, ...args: string[]): string[] {
    let kvps = argparse(args);
    if (kvps.length) {
        if (kvps[0].key == "help") {
            return HELP;
        }
    }
    controller.regenerateTerrain();
    return ["Successfully regenerated map"];
}
