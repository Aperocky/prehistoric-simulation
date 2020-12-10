import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { Square, Terrain, TERRAIN_STR } from '../../map/square';
import { DEFAULT_MAP_SIZE } from '../../constant/displayConstants';
import { DIRECTIONS_DESCRIPTION } from '../../constant/mapConstants';

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
    let result: string[] = [];
    result.push(`----- SQUARE AT (${x}, ${y}) -----`);
    result.push(`Terrain: ${TERRAIN_STR.get(square.terrain)}`);
    result.push(`Altitude: ${square.altitude} m`);
    result.push(`Precipitation: ${square.precip} mm`);
    if (square.isRiver()) {
        let rdesc = square.flowVolume < 10
                ? "Creek"
                : square.flowVolume < 20
                ? "Stream" : "River";
        result.push(`${rdesc} flows ${DIRECTIONS_DESCRIPTION.get(square.flowDirection)}`);
    }
    return result;
}
