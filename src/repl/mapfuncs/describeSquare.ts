import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { Square, Terrain, TERRAIN_STR } from '../../map/square';
import { getHealth, getAge } from '../../map/simSquare';
import { DEFAULT_MAP_SIZE } from '../../constant/displayConstants';
import { DIRECTIONS_DESCRIPTION } from '../../constant/mapConstants';
import { locationToString } from '../../sim/util/location';
import { WORK_TYPES } from '../../sim/people/work/workTypes';
import { describeWork, roundTo } from '../util';

const HELP = [
    "describe selected square",
    "x: x coordinate of the square",
    "y: y coordinate of the square",
    "example$ square x=1 y=1"
];

export default function describeSquare(controller: Controller, ...args: string[]): string[] {
    let kvps = argparse(args);
    let xstr: string;
    let ystr: string;
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
    return describe(controller, x, y);
}

function describe(controller: Controller, x: number, y: number): string[] {
    let square: Square = controller.terrain[y][x];
    let coastStr: string = square.isCoast ? "Coastal " : "";
    let result: string[] = [];
    result.push(`----- SQUARE AT (${x}, ${y}) -----`);
    result.push(`Terrain: ${coastStr}${TERRAIN_STR.get(square.terrain)}`);
    result.push(`Altitude: ${square.altitude} m`);
    result.push(`Precipitation: ${square.precip} mm`);
    if (square.isRiver()) {
        let rdesc = square.flowVolume < 10
                ? "Creek"
                : square.flowVolume < 20
                ? "Stream" : "River";
        result.push(`${rdesc} flows ${DIRECTIONS_DESCRIPTION.get(square.flowDirection)}`);
    }
    result = result.concat(describePopulation(controller, x, y));
    return result.concat(describeProduction(controller, x, y));
}

function describePopulation(controller: Controller, x: number, y: number): string[] {
    let square = controller.terrain[y][x];
    let result = [];
    if (square.simInfo.households.length) {
        result.push("------ PEOPLE ------");
        result.push(`${square.simInfo.households.length} households are here`);
        result.push(`${square.simInfo.people.length} persons live here`);
        result.push(`Average Age: ${roundTo(getAge(square.simInfo))}`)
        result.push(`Average Adult Health: ${roundTo(getHealth(square.simInfo))}`)
        result.push("------- WORK -------");
        result = result.concat(describeWork(square.simInfo.people));
    }
    return result;
}

function describeProduction(controller: Controller, x: number, y: number): string[] {
    let result = [];
    let squareProduction = controller.simulation.simProduction.board[y][x];
    Object.entries(squareProduction.productionRegistry).forEach(entry => {
        let [workType, produce] = entry;
        let workforce = Object.values(squareProduction.workRegistry[workType]).length;
        let workName = WORK_TYPES[workType].name;
        let produceType = WORK_TYPES[workType].produceType;
        produce = Math.floor(produce * 100)/100;
        result.push(`${workforce} ${workName} produces ${produce} unit of ${produceType}`);
    });
    return result;
}
