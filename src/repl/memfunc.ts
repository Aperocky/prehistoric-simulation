import { Controller } from '../controller';
import { argparse, KeyValue } from './parser';
import { cmdprint } from './util';


const HELP = [
    "run commands stored in memory (by previous function)",
    "example$ mem 1",
];


export default function memfunc(controller: Controller, ...args: string[]): string[] {
    let kvps = argparse(args);
    let index = -1;
    if (kvps.length) {
        if (kvps[0].key == "help") {
            let currStored = controller.replTerminal.memcmds.length;
            return HELP.concat([`${currStored} commands currently stored`]);
        }
        index = parseInt(kvps[0].key);
    }
    if (!Number.isNaN(index)) {
        return remember(index, controller);
    }
    return ["Index must be number"];
}


function remember(index: number, controller: Controller): string[] {
    let memcmds = controller.replTerminal.memcmds;
    if (index < 0 || index >= memcmds.length) {
        return [
            "Index out of bounds, there are:",
            `${memcmds.length} memories stored`
        ];
    }
    controller.replTerminal.writeCommand(memcmds[index]);
    controller.replTerminal.command = memcmds[index];
    controller.replTerminal.processCommand(true);
    return [];
}
