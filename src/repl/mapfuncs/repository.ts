import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { REPO_LOCATION } from '../../constant/simConstants';

const HELP = [
    "go to code repository",
];

export default function repository(controller: Controller, ...args: string[]): string[] {
    // Describe the current map
    let kvps = argparse(args);
    if (kvps.length) {
        if (kvps[0].key == "help") {
            return HELP;
        }
    }
    window.location.href = REPO_LOCATION;
    return [REPO_LOCATION]
}
