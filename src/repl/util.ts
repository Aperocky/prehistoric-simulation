import { Person } from '../sim/people/person';
import { WORK_TYPES } from '../sim/people/work/workTypes';

export function describeWork(people: Person[]): string[] {
    let result = [];
    let workHash: {[work: string]: number} = {};
    people.forEach(p => {
        let work = p.age < 14
                ? "Child"
                : WORK_TYPES[p.work.work].name;
        if (work in workHash) {
            workHash[work] += 1;
        } else {
            workHash[work] = 1;
        }
    });
    Object.entries(workHash)
        .sort(([,a],[,b]) => b-a)
        .forEach(entry => {
            const [key, value] = entry;
            result.push(`${key}: ${value}`)
        });
    return result;
}

export function describeProduction(people: Person[]): string[] {
    let result = [];
    let prodHash: {[work: string]: number} = {};
    people.forEach(p => {
        let produce = p.work.produce;
        let produceType = WORK_TYPES[p.work.work].produceType;
        if (produceType in prodHash) {
            prodHash[produceType] += produce;
        } else {
            prodHash[produceType] = produce;
        }
    });
    Object.entries(prodHash)
        .sort(([,a],[,b]) => b-a)
        .forEach(entry => {
            const [key, value] = entry;
            result.push(`${key}: ${roundTo(value)}`)
        });
    return result;
}

export function roundTo(num: number, decimals: number = 2): number {
    let factor = 10**decimals;
    return Math.floor(num * factor)/factor;
}


export function cmdprint(cmd) {
    return `\x1b[36;48;2;48;48;48m${cmd}\x1b[0;37m`;
}
