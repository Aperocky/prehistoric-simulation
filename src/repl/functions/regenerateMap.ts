import { Controller } from '../../controller';
import { argparse, KeyValue } from './util';
import describeMap from './describeMap';

const HELP = [
    "regenerate the map",
    "--show: show the description of the map after regneration"
];

export default function regenerateMap(controller: Controller, ...args: string[]): string[] {
    let kvps = argparse(args);
    let showflag = false;
    if (kvps.length) {
        if (kvps[0].key == "help") {
            return HELP;
        }
        while (kvps.length) {
            let kv = kvps.shift();
            if (kv.key == "show") {
                showflag = true;
            }
        }
    }
    controller.generateTerrain();
    let results = ["Successfully regenerated map"];
    if (showflag) {
        results = results.concat(describeMap(controller));
    }
    return results;
}
