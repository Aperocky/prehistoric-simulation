import { Person } from '../sim/people/person';
import { Household } from '../sim/people/household';
import { ResourceType } from '../sim/people/properties/resourceTypes';
import { WORK_TYPES } from '../sim/people/work/workTypes';


export const HELP_COLUMNS = ["COMMAND", "ALIAS", "EXAMPLE", "USAGE"];


export function describePeople(households: Household[], people: Person[]): string[] {
    let result = [];
    let totalWealth = households.reduce((sum, hh) => sum + hh.storage.gold, 0);
    let hungry = households.filter(hh => {
        if (ResourceType.Food in hh.percentSatisfied) {
            return hh.percentSatisfied[ResourceType.Food] < 1
        }
        return false;
    });
    let singles = households.filter(hh => hh.isSingle)
    let avgAge = people.reduce((sum, p) => sum + p.age, 0)/people.length;
    let adults = people.filter(p => p.age >= 14);
    let title = "PEOPLE";
    let header = ["TYPE", "COUNT"];
    let rows: string[][] = [];
    rows.push(["PEOPLE", people.length.toString()]);
    rows.push(["HOUSEHOLDS", households.length.toString()]);
    rows.push(["SINGLES", singles.length.toString()]);
    rows.push(["WEALTH", roundTo(totalWealth).toString()]);
    rows.push(["AVG AGE", roundTo(avgAge).toString()]);
    if (adults.length) {
        let avgAdultHealth = adults.reduce((sum, p) => sum + p.health, 0)/adults.length;
        rows.push(["AVG HEALTH", roundTo(avgAdultHealth).toString()]);
    }
    rows.push(["HUNGER", `${hungry.length}/${households.length}`]);
    return createTable(title, header, rows);
}


export function describeWork(people: Person[]): string[] {
    let result = [];
    let workHash: {[work: string]: number} = {};
    people.forEach(p => {
        let work = p.age < 14
                ? "child"
                : WORK_TYPES[p.work.work].name;
        if (work in workHash) {
            workHash[work] += 1;
        } else {
            workHash[work] = 1;
        }
    });
    let rows: string[][] = [];
    let children = 0;
    Object.entries(workHash)
        .sort(([,a],[,b]) => b-a)
        .forEach(entry => {
            const [key, value] = entry;
            if (key == "child") {
                children = value;
            } else {
                rows.push([key, value.toString()]);
            }
        });
    if (children) {
        rows.push(["Child", children.toString()]);
    }
    let title = "WORK";
    let header = ["TYPE", "COUNT"];
    return createTable(title, header, rows);
}


export function describeIncome(people: Person[]): string[] {
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
    let rows: string[][] = [];
    Object.entries(prodHash)
        .sort(([,a],[,b]) => b-a)
        .forEach(entry => {
            const [key, value] = entry;
            rows.push([key.toUpperCase(), roundTo(value).toString()]);
        });
    let title = "INCOME";
    let header = ["RESOURCE", "COUNT"];
    return createTable(title, header, rows);
}


export function householdsList(households: Household[]): string[] {
    let result = [];
    let title = "HOUSEHOLDS";
    households.sort((ha, hb) => Math.max(...hb.adults.map(p => p.age)) - Math.max(...ha.adults.map(p => p.age)));
    let header = ["INDEX", "SURNAME", "OLDEST", "MEMBERS", "WEALTH", "STAY"];
    let rows: string[][] = [];
    let cmds: string[] = [];
    households.forEach((hh, i) => {
        let stay = hh.stay > 10 ? "LOCAL" : hh.stay.toString();
        rows.push([
            (i+1).toString(),
            hh.adults[0].heritage.surname,
            Math.max(...hh.adults.map(p => p.age)).toString(),
            (hh.adults.length + hh.dependents.length).toString(),
            roundTo(hh.storage.gold).toString(),
            stay
        ]);
        cmds.push(`${i+1}: ${cmdprint(`hh --id=${hh.id}`)}`);
    });
    let table = createTable(title, header, rows);
    return table.concat(cmds);
}


export function roundTo(num: number, decimals: number = 2): number {
    let factor = 10**decimals;
    return Math.floor(num * factor)/factor;
}


export function cmdprint(cmd) {
    return `\x1b[36;48;2;48;48;48m${cmd}\x1b[0;37m`;
}


export function createTable(title: string, header: string[], rows: string[][], width: number = 0): string[] {
    let result = [];
    let barPush = (bar, toper = false) => {
        let ender = toper ? '-' : '|';
        result.push(ender + bar + ender);
    };
    let varLengths: number[];
    if (width) {
        varLengths = Array(header.length).fill(width);
    } else {
        varLengths = getVariableLength(header, rows);
    }
    let fullLength = varLengths.reduce((sum, e) => sum + e, 0) + varLengths.length - 1;
    let titleBar = `\x1b[1;97;48;2;100;120;120m   ${title}${' '.repeat(fullLength - title.length - 3)}\x1b[0;37m`;
    let headerBar = header.map((e, i) => createElement(e, varLengths[i])).join('|');
    let breakBar = header.map((e, i) => '-'.repeat(varLengths[i])).join('|');
    let rowBars = rows.map(row => row.map((e, i) => createElement(e, varLengths[i])).join('|'));
    let finalBar = '-'.repeat(fullLength);
    barPush(titleBar);
    barPush(headerBar);
    barPush(breakBar);
    rowBars.forEach(bar => barPush(bar));
    barPush('-'.repeat(fullLength), true);
    return result;
}


function getVariableLength(header: string[], rows: string[][]): number[] {
    let varLengths = [];
    for (let i = 0; i < header.length; i++) {
        let maxLength = header[i].length;
        rows.forEach(row => {
            maxLength = row[i].length > maxLength ? row[i].length : maxLength;
        });
        varLengths.push(maxLength + 2);
    }
    return varLengths;
}


function createElement(element: string, width: number, prefixSpace = 1): string {
    if (element.length > width - prefixSpace - 1) {
        element = element.substring(0, width - prefixSpace - 1);
    }
    return ' '.repeat(prefixSpace) + element + ' '.repeat(width - prefixSpace - element.length);
}
