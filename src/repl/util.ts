import { Person } from '../sim/people/person';
import { Household } from '../sim/people/household';
import { Controller } from '../controller';
import { ResourceType, houseToStr } from '../sim/people/properties/resourceTypes';
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
    let totalHousing = households.reduce((sum, hh) => sum + hh.storage.getResource("housing"), 0);
    let avgAge = people.reduce((sum, p) => sum + p.age, 0)/people.length;
    let adults = people.filter(p => p.age >= 14);
    let title = "PEOPLE";
    let header = ["TYPE", "COUNT"];
    let rows: string[][] = [];
    rows.push(["PEOPLE", people.length.toString()]);
    rows.push(["HOUSEHOLDS", households.length.toString()]);
    rows.push(["SINGLES", singles.length.toString()]);
    rows.push(["WEALTH", roundTo(totalWealth).toString()]);
    rows.push(["HOUSING", roundTo(totalHousing).toString()]);
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
    type Record = {
        people: number;
        total: number;
        max: number;
    }
    let prodHash: {[work: string]: Record} = {};
    people.forEach(p => {
        let work = p.work.work;
        let produce = p.work.produce;
        let produceType = WORK_TYPES[p.work.work].produceType;
        if (work in prodHash) {
            prodHash[work].total += produce;
            prodHash[work].people++;
            if (produce > prodHash[work].max) {
                prodHash[work].max = produce;
            }
        } else {
            prodHash[work] = {
                people: 1,
                total: produce,
                max: produce,
            };
        }
    });

    let rows: string[][] = [];
    Object.entries(prodHash)
        .sort(([,a],[,b]) => b.total - a.total)
        .forEach(entry => {
            const [key, value] = entry;
            rows.push([
                WORK_TYPES[key].name,
                value.people.toString(),
                WORK_TYPES[key].produceType,
                roundTo(value.total).toString(),
                roundTo(value.max).toString(),
                roundTo(value.total/value.people).toString()
            ]);
        });
    let title = "INCOME";
    let header = ["WORK", "PEOPLE", "RESOURCE", "TOTAL", "MAX", "AVG"];
    return createTable(title, header, rows);
}


export function describeLocalMarket(households: Household[]) {
    let result = [];
    type Record = {
        totalIncome: number;
        totalBought: number;
        totalSold: number;
        totalStorage: number;
    };
    let records: {[resource: string]: Record} = {
        "gold": {
            totalIncome: 0,
            totalBought: 0,
            totalSold: 0,
            totalStorage: 0,
        }
    };
    households.forEach(hh => {
        hh.allDo(p => {
            let resource = WORK_TYPES[p.work.work].produceType;
            if (resource in records) {
                records[resource].totalIncome += p.work.produce;
            } else {
                records[resource] = {
                    totalIncome: p.work.produce,
                    totalBought: 0,
                    totalSold: 0,
                    totalStorage: 0,
                }
            }
        });
        hh.orders.filter(o => o.delivered).forEach(o => {
            if (!(o.resourceName in records)) {
                records[o.resourceName] = {
                    totalIncome: 0,
                    totalBought: 0,
                    totalSold: 0,
                    totalStorage: 0,
                };
            }
            if (o.orderType) {
                records[o.resourceName].totalBought += o.quantity;
                records["gold"].totalSold += o.quantity * o.settlePrice;
            } else {
                records[o.resourceName].totalSold += o.quantity;
                records["gold"].totalBought += o.quantity * o.settlePrice;
            }
        });
        for (const [resource, amount] of Object.entries(hh.storage.storage)) {
            if (!(resource in records)) {
                records[resource] = {
                    totalIncome: 0,
                    totalBought: 0,
                    totalSold: 0,
                    totalStorage: 0,
                };
            }
            records[resource].totalStorage += amount;
        }
        records["gold"].totalStorage += hh.storage.gold;
    });

    let rows: string[][] = [];
    for (const [resource, record] of Object.entries(records)) {
        rows.push([
            resource,
            roundTo(record.totalIncome).toString(),
            roundTo(record.totalBought).toString(),
            roundTo(record.totalSold).toString(),
            roundTo(record.totalStorage).toString(),
        ]);
    }
    let title = "LOCAL MARKET";
    let header = ["RESOURCE", "INCOME", "BOUGHT", "SOLD", "STORAGE"];
    return createTable(title, header, rows);
}


export function describeStorage(households: Household[]): string[] {
    let title = "STORAGE"
    let header = ["RESOURCE", "QUANTITY"]
    let rows: string[][] = [];
    let quantityMap: {[resource: string]: number} = {};
    let gold = 0;
    households.forEach(hh => {
        Object.entries(hh.storage.storage).forEach(entry => {
            const [key, val] = entry;
            if (key in quantityMap) {
                quantityMap[key] += val;
            } else {
                quantityMap[key] = val;
            }
        });
        gold += hh.storage.gold;
    });
    Object.entries(quantityMap).forEach(entry => {
        const [key, val] = entry;
        rows.push([key.toUpperCase().toString(), roundTo(val).toString()]);
    });
    rows.push(["GOLD", roundTo(gold).toString()]);
    return createTable(title, header, rows);
}


export function householdsList(households: Household[], controller: Controller): string[] {
    let result = [];
    let title = "HOUSEHOLDS";
    households.sort((ha, hb) => hb.storage.getResource("housing") - ha.storage.getResource("housing"));
    let header = ["INDEX", "SURNAME", "MEMBERS", "WEALTH", "STAY", "DWELLING"];
    let rows: string[][] = [];
    controller.replTerminal.memcmds = [];
    households.forEach((hh, i) => {
        let stay = hh.stay > 10 ? "LOCAL" : hh.stay.toString();
        rows.push([
            i.toString(),
            hh.adults[0].heritage.surname,
            (hh.adults.length + hh.dependents.length).toString(),
            roundTo(hh.storage.gold).toString(),
            stay,
            houseToStr(hh.storage.getResource("housing"))
        ]);
        controller.replTerminal.memcmds.push(`hh --id=${hh.id}`);
    });
    let table = createTable(title, header, rows);
    table.push(`use ${cmdprint('mem $index')} to inspect individual rows`);
    return table;
}


export function classList(households: Household[]): string[] {
    let result = [];
    let title = "CLASS DISTRIBUTION";
    let header = ["DWELLING", "HOUSEHOLDS", "PEOPLE", "HUNGRY", "AVG SPACE"];
    let rows: string[][] = [];
    let dist: {[clazz: string]: Household[]} = {};
    households.sort((ha, hb) => hb.storage.getResource(ResourceType.Haus) - ha.storage.getResource(ResourceType.Haus));
    households.forEach(hh => {
        let dwelling = houseToStr(hh.storage.getResource(ResourceType.Haus))
        if (dwelling in dist) {
            dist[dwelling].push(hh);
        } else {
            dist[dwelling] = [hh];
        }
    });
    for (const [key, val] of Object.entries(dist)) {
        let totalSpace = val.reduce((sum, hh) => sum + hh.storage.getResource(ResourceType.Haus), 0);
        let averageSpace = totalSpace/val.length;
        let hunperc = val.filter(hh => hh.adults[0].isHungry()).length/val.length;
        rows.push([
            key,
            val.length.toString(),
            val.reduce((sum, hh) => sum + hh.totalPersons(), 0).toString(),
            roundTo(hunperc * 100, 1).toString() + "%",
            roundTo(averageSpace).toString()
        ]);
    }
    let totalSpace = households.reduce((sum, hh) => sum + hh.storage.getResource(ResourceType.Haus), 0);
    let averageSpace = totalSpace/households.length;
    let hunperc = households.filter(hh => hh.adults[0].isHungry()).length/households.length;
    rows.push([
        "TOTAL",
        households.length.toString(),
        households.reduce((sum, hh) => sum + hh.totalPersons(), 0).toString(),
        roundTo(hunperc * 100, 1).toString() + "%",
        roundTo(averageSpace).toString(),
    ]);
    return createTable(title, header, rows);
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
