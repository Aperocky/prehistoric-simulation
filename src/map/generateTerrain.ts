import simplexGenerator from './simplexGenerator';
import calculateRiverMap from './calculateRiverMap';
import { Square } from './square';
import * as mapConstants from '../constant/mapConstants';

export default function generateTerrain(size: number): Square[][] {
    let heightMap = simplexGenerator(size, "altitude");
    let precipMap = simplexGenerator(size, "precip");
    return genSquareMap(heightMap, precipMap);
}

function genSquareMap(heightMap: number[][], precipMap: number[][]): Square[][] {
    let size = heightMap.length;
    let riverMap = calculateRiverMap(heightMap, precipMap, mapConstants.RIVER_THRESHOLD);
    let squareMap: Square[][] = [];
    for (let y = 0; y < size; y++) {
        let latitude: Square[] = [];
        for (let x = 0; x < size; x++) {
            let square = new Square(heightMap[y][x], precipMap[y][x], riverMap[y][x], x, y);
            latitude.push(square);
        }
        squareMap.push(latitude);
    }
    return squareMap;
}

export const testfuncs = {
    genSquareMap: genSquareMap
}
