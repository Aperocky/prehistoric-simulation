import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { Square, Terrain, TERRAIN_STR } from '../../map/square';
import { createTable, HELP_COLUMNS } from '../util';

const HELP = [
    "describe the current map"
];

export default function describeMap(controller: Controller, ...args: string[]): string[] {
    // Describe the current map
    let kvps = argparse(args);
    if (kvps.length) {
        if (kvps[0].key == "help") {
            return HELP;
        }
    }
    return readTerrainTypes(controller.terrain);
}

function readTerrainTypes(terrainMap: Square[][]): string[] {
    // Count terrain and report them.
    let result: string[] = []
    result.push('-----TERRAIN TYPES-----');
    let mapCounter: Map<Terrain, number> = new Map();
    [].concat(...terrainMap).forEach(square => {
        if (mapCounter.has(square.terrain)) {
            mapCounter.set(square.terrain, mapCounter.get(square.terrain)+1);
        } else {
            mapCounter.set(square.terrain, 1);
        }
    })
    let title = "TERRAIN";
    let header = ["TERRAIN", "COUNT"];
    let rows: string[][] = [];
    mapCounter.forEach((val, key) => {
        rows.push([TERRAIN_STR.get(key), val.toString()]);
    });
    return createTable(title, header, rows);
}
