import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { DisplayMode } from '../../constant/displayConstants';

const HELP = [
    "change display mode",
    "mode default: default display mode",
    "mode density: population density",
    "mode health: population health"
];

const MODES = {
    default: DisplayMode.Default,
    density: DisplayMode.PopulationDensity,
    health: DisplayMode.Health
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
    ]
}
