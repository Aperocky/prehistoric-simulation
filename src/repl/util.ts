import { Person } from '../sim/people/person';
import { WORK_TYPES } from '../sim/people/work/workTypes';

export function describeWork(people: Person[]): string[] {
    let result = [];
    let workHash: {[work: string]: number} = {};
    people.forEach(p => {
        let work = p.age < 10
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
