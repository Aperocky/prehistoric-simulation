import { Controller } from '../controller';
import regenerateMap from './mapfuncs/regenerateMap';
import debug from './mapfuncs/debug';
import describeMap from './mapfuncs/describeMap';
import describeSquare from './mapfuncs/describeSquare';
import repository from './mapfuncs/repository';


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
FUNC_MAP.set("repository", repository);
FUNC_MAP.set("repo", repository);


const HELP_MAP: Map<string, string[]> = new Map();
HELP_MAP.set("regenerate", ["regenerate", "reg"]);
HELP_MAP.set("describe-map", ["describe-map", "map"]);
HELP_MAP.set("describe-square", ["describe-square", "square"]);
HELP_MAP.set("repository", ["repository", "repo"]);


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
