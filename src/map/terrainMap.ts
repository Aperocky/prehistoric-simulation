import simplexGenerator from './simplexGenerator';
import calculateRiverMap from './calculateRiverMap';

export enum Terrain {
    Deep = 0,
    Water = 1,
    Grassland = 2,
    Forest = 3,
    Mountain = 4,
    Desert = 5,
    Shore = 6,
}

export class TerrainMap {

    size: number;
    heightMap: number[][];
    precipMap: number[][];
    riverMap: number[][];

    constructor(size: number) {
        this.heightMap = generator(size, "altitude");
        this.precipMap = generator(size, "precip");
        this.riverMap = calculateRiverMap(this.heightMap, this.precipMap, 5);
    }
}
