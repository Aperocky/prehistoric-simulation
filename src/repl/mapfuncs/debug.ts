import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';

const HELP = [
    "USE ME TO DEBUG",
    "MULTILINE",
    "SWEET BABY TERMINAL"
];

export default function debug(controller: Controller, ...args: string[]): string[] {
    let kvps = argparse(args);
    let results: string[] = [];
    if (kvps.length) {
        if (kvps[0].key == "help") {
            return HELP;
        } else {
            results.push('-----debug-----');
            kvps.forEach(kv => {
                results.push(`key=${kv.key}, value=${kv.value}`);
            });
            results.push('-----debug-----');
        }
    }
    return results;
}
