import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';

const HELP = [
    "change display mode",
    "mode default: default display mode",
    "mode density: population density",
    "mode health: population health",
    "mode city: display cities",
    "mode age: display average age"
];

const MODES = {
    default: "DEFAULT",
    density: "DENSITY",
    health: "HEALTH",
    age: "AGE",
    city: "CITY",
}

export default function displayMode(controller: Controller, ...args: string[]): string[] {
    let kvps = argparse(args);
    let mode = "";
    if (kvps.length) {
        if (kvps[0].key == "help") {
            return HELP;
        } else {
            mode = kvps[0].key.toLowerCase();
        }
    }
    if (mode in MODES) {
        controller.mapCanvas.changeMode(MODES[mode]);
        return [`Changed display mode to ${mode}`];
    }
    return [
        `No display mode '${mode}', the acceptable modes are`,
        'default',
        'density',
        'health',
        'age',
        'city',
    ]
}
