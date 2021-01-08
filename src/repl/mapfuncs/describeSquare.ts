import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { Square, Terrain, TERRAIN_STR } from '../../map/square';
import { DEFAULT_MAP_SIZE } from '../../constant/displayConstants';
import { DIRECTIONS_DESCRIPTION } from '../../constant/mapConstants';
import { locationToString } from '../../sim/util/location';
import { WORK_TYPES } from '../../sim/people/work/workTypes';
import { roundTo, describePeople, createTable, householdsList, describeStorage, classList, describeIncome } from '../util';
import { ResourceType } from '../../sim/people/properties/resourceTypes';


const HELP = [
    "describe selected square",
    "x: x coordinate of the square",
    "y: y coordinate of the square",
    "[--hh] show list of households",
    "[--store] show all storage",
    "[--city] show city stats",
    "example$ square x=1 y=1",
    "example$ square x=1 y=1 hh",
    "example$ square x=1 y=1 store",
];


export default function describeSquare(controller: Controller, ...args: string[]): string[] {
    let kvps = argparse(args);
    let xstr: string;
    let ystr: string;
    let hh = false;
    let store = false;
    let city = false;
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
            if (kv.key == "store" || kv.key == "storage") {
                store = true;
            }
            if (kv.key == "city") {
                city = true;
            }
        }
    }
    if (xstr === undefined || ystr === undefined) {
        return ["Need x and y coordinates to proceed"];
    }
    let x = parseInt(xstr);
    let y = parseInt(ystr);
    if (x < 0 || y < 0 || x >= DEFAULT_MAP_SIZE || y >= DEFAULT_MAP_SIZE) {
        return ["x and y coordinates must be in map"];
    }
    if (hh) {
        return householdsList(controller.terrain[y][x].simInfo.households, controller);
    }
    if (store) {
        return describeStorage(controller.terrain[y][x].simInfo.households);
    }
    if (city) {
        return describeCity(controller.terrain[y][x]);
    }
    return describe(controller, x, y);
}


function describe(controller: Controller, x: number, y: number): string[] {
    let square: Square = controller.terrain[y][x];
    let result = [];
    result.push(...describeSquareItself(square));
    if (square.simInfo.households.length) {
        result.push(...describePeople(square.simInfo.households, square.simInfo.people));
    }
    result.push(...describeProduction(controller, x, y))
    return result;
}


function describeSquareItself(square: Square): string[] {
    let title = "SQUARE";
    let header = ["ATTRIBUTE", "VALUE"];
    let rows: string[][] = [];
    let terrain = square.simInfo.isFarm ? "FARM" : TERRAIN_STR.get(square.terrain);
    rows.push(["LOCATION", `(${square.x}, ${square.y})`]);
    rows.push(["ALTITUDE", `${roundTo(square.altitude)} m`]);
    rows.push(["TERRAIN", terrain]);
    rows.push(["PRECIPITATION", `${roundTo(square.precip)} mm`]);
    if (square.isMine) {
        rows.push(["MINE", "IRON MINE"]);
    }
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
    let title = "PUBLIC PRODUCTION";
    let header = ["JOB", "PEOPLE", "RESOURCE", "COUNT"]
    if (rows.length) {
        return createTable(title, header, rows);
    }
    return [];
}


function describeCity(square: Square): string[] {
    let people = square.simInfo.people;
    let households = square.simInfo.households;
    let result = [];
    result.push(...classList(households));
    result.push(...describeIncome(people));
    result.push(...describeStorage(households));
    return result;
}
