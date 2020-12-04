import { Controller } from '../controller';
import regenerateMap from './functions/regenerateMap';
import debug from './functions/debug';
import describeMap from './functions/describeMap';
import describeSquare from './functions/describeSquare';


interface ReplFunction {
    (controller: Controller, ...args: string[]): string[];
}


const FUNC_MAP: Map<string, ReplFunction> = new Map();
FUNC_MAP.set("regenerate", regenerateMap);
FUNC_MAP.set("reg", regenerateMap);
FUNC_MAP.set("debug", debug);
FUNC_MAP.set("describe-map", describeMap);
FUNC_MAP.set("map", describeMap);
FUNC_MAP.set("describe-square", describeSquare);
FUNC_MAP.set("square", describeSquare);


const HELP_MAP: Map<string, string[]> = new Map();
HELP_MAP.set("regenerate", ["regenerate", "reg"]);
HELP_MAP.set("describe-map", ["describe-map", "map"]);
HELP_MAP.set("describe-square", ["describe-square", "square"]);


export default function processor(controller: Controller, command: string): string[] {
    let args = command.split(" ");
    let base = args.shift();
    if (base === "help") {
        return help();
    } else if (base === "man" && args.length) {
        return processor(controller, `${args[0]} help`)
    } else if (FUNC_MAP.has(base)) {
        return FUNC_MAP.get(base)(controller, ...args);
    } else {
        return [`command not found: ${base}`];
    }
}


function help(): string[] {
    let result: string[] = [];
    HELP_MAP.forEach((val, key) => {
        let command = val[0];
        if (val.length) {
            command += ` (${val.slice(1).toString()})`;
        }
        result.push(command)
        let helpMessage: string[] = FUNC_MAP.get(key)(undefined, 'help');
        helpMessage.forEach(h => {
            result.push(`    ${h}`);
        });
    });
    result.push('clear');
    result.push('    clear all console output');
    return result;
}