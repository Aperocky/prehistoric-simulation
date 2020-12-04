export interface KeyValue {
    key: string;
    value?: string;
}

export function argparse(args: string[]): KeyValue[] {
    let kvPairs = [];
    args.forEach(arg => {
        kvPairs.push(sanitize(arg));
    });
    return kvPairs;
}

function sanitize(arg: string): KeyValue {
    if (arg.includes("=")) {
        let keyVal = arg.split("=", 2);
        let key = keyVal[0].replace(/^-+/, '');
        return { key: key, value: keyVal[1] };
    } else {
        let key = arg.replace(/^-+/, '');
        return { key: key };
    }
}
