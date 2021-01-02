import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { Square, Terrain, TERRAIN_STR } from '../../map/square';
import { DEFAULT_MAP_SIZE } from '../../constant/displayConstants';
import { DIRECTIONS_DESCRIPTION } from '../../constant/mapConstants';
import { locationToString } from '../../sim/util/location';
import { WORK_TYPES } from '../../sim/people/work/workTypes';
import { describeWork, roundTo, describePeople, createTable, householdsList } from '../util';
import { describeIncome } from '../util';
import { ResourceType } from '../../sim/people/properties/resourceTypes';


const HELP = [
    "describe selected square",
    "x: x coordinate of the square",
    "y: y coordinate of the square",
    "[--hh] show list of households",
    "example$ square x=1 y=1",
    "example$ square x=1 y=1 hh"
];

export default function describeSquare(controller: Controller, ...args: string[]): string[] {
    let kvps = argparse(args);
    let xstr: string;
    let ystr: string;
    let hh: boolean = false;
    if (kvps.length) {
        if (kvps[0].key == "help") {
            return HELP;
        }
        while (kvps.length) {
            let kv = kvps.shift();
            if (kv.key == "x") {
                if (kv.value !== undefined) {
                    xstr = kv.value;
                }
            }
            if (kv.key == "y") {
                if (kv.value !== undefined) {
                    ystr = kv.value;
                }
            }
            if (kv.key == "hh" || kv.key == "households") {
                hh = true;
            }
        }
    }
    if (xstr === undefined || ystr === undefined) {
        return ["Need x and y coordinates to proceed"];
    }
    let x: number = parseInt(xstr);
    let y: number = parseInt(ystr);
    if (x < 0 || y < 0 || x >= DEFAULT_MAP_SIZE || y >= DEFAULT_MAP_SIZE) {
        return ["x and y coordinates must be in map"];
    }
    if (hh) {
        return householdsList(controller.terrain[y][x].simInfo.households);
    }
    return describe(controller, x, y);
}


function describe(controller: Controller, x: number, y: number): string[] {
    let square: Square = controller.terrain[y][x];
    let result = [];
    result.push(...describeSquareItself(square));
    if (square.simInfo.households.length) {
        result.push(...describePeople(square.simInfo.households, square.simInfo.people));
        result.push(...describeWork(square.simInfo.people));
        result.push(...describeIncome(square.simInfo.people));
    }
    result.push(...describeProduction(controller, x, y))
    return result;
}


function describeSquareItself(square: Square): string[] {
    let title = "SQUARE";
    let header = ["ATTRIBUTE", "VALUE"];
    let rows: string[][] = [];
    rows.push(["LOCATION", `(${square.x}, ${square.y})`]);
    rows.push(["ALTITUDE", `${roundTo(square.altitude)} m`]);
    rows.push(["TERRAIN", TERRAIN_STR.get(square.terrain)]);
    rows.push(["PRECIPITATION", `${roundTo(square.precip)} mm`]);
    if (square.isRiver()) {
        rows.push(["RIVER", DIRECTIONS_DESCRIPTION.get(square.flowDirection)]);
        rows.push(["RIVER VOLUME", roundTo(square.flowVolume).toString()]);
    }
    return createTable(title, header, rows);
}


function describeProduction(controller: Controller, x: number, y: number): string[] {
    let result = [];
    let squareProduction = controller.simulation.simProduction.board[y][x];
    let rows: string[][] = [];
    Object.entries(squareProduction.productionRegistry).forEach(entry => {
        let [workType, produce] = entry;
        let workforce = Object.values(squareProduction.workRegistry[workType]).length;
        let workName = WORK_TYPES[workType].name;
        let produceType = WORK_TYPES[workType].produceType;
        result.push(`${workforce} ${workName} produces ${produce} unit of ${produceType}`);
        rows.push([workName, workforce.toString(), produceType, roundTo(produce).toString()]);
    });
    let title = "PRODUCTION";
    let header = ["JOB", "PEOPLE", "RESOURCE", "COUNT"]
    if (rows.length) {
        return createTable(title, header, rows);
    }
    return [];
}
