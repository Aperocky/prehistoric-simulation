import * as mapConstants from '../constant/mapConstants';
import { SimSquare, initSimInfo } from './simSquare';

export enum Terrain {
    Water = 1,
    Grass = 2,
    Forest = 3,
    MountainRock = 4,
    Desert = 5,
    MountainGrass = 6,
    Woods = 7
}

export const TERRAIN_STR : Map<number, string> = new Map();
TERRAIN_STR.set(1, "Water");
TERRAIN_STR.set(2, "Grass");
TERRAIN_STR.set(3, "Forest");
TERRAIN_STR.set(4, "Mountain");
TERRAIN_STR.set(5, "Desert");
TERRAIN_STR.set(6, "Highland");
TERRAIN_STR.set(7, "Woods");

// Square represent each locations.
export class Square {

    altitude: number;
    precip: number;
    terrain: Terrain;
    flowDirection: number;
    flowVolume: number;
    // Good for a square to know its current location.
    x: number;
    y: number;
    isCoast: boolean;

    // is a mine
    isMine: boolean;

    // Sim related information
    simInfo: SimSquare;

    constructor(height: number, precip: number, flowDirection: number, flowVolume: number,
            x: number, y: number) {
        this.x = x;
        this.y = y;
        this.altitude = this.getRealHeight(height);
        this.precip = this.getRealPrecip(precip);
        this.flowDirection = flowDirection;
        this.flowVolume = flowVolume;
        this.terrain = this.getTerrain();
        this.isCoast = false;
        this.simInfo = initSimInfo();
        this.deterMine();
    }

    setCoast(): void {
        this.isCoast = true;
    }

    isRiver(): boolean {
        return (!this.isWater() && this.flowVolume > mapConstants.RIVER_THRESHOLD);
    }

    isWater(): boolean {
        return this.flowDirection == 4
            && this.flowVolume > mapConstants.RIVER_THRESHOLD
            || this.altitude < 0
            || this.flowVolume > 50;
    }

    private getRealHeight(rawHeight: number): number {
        return (rawHeight - mapConstants.ALTITUDE_ADJUST) * mapConstants.ALTITUDE_SCALAR;
    }

    private getRealPrecip(rawPrecip: number): number {
        return rawPrecip * mapConstants.PRECIPITATION_SCALAR;
    }

    private getTerrain(): Terrain {
        if (this.isWater()) {
            return Terrain.Water;
        }
        let flowPrecip = this.flowVolume * mapConstants.RIVER_PRECIP_EFFECT;
        let effectivePrecip = this.precip + ((flowPrecip > 300) ? 300 : flowPrecip);
        if (this.altitude < mapConstants.MOUNTAIN_ALTITUDE) {
            return effectivePrecip < mapConstants.DESERT_BIOME_PRECIP_CUTOFF
                    ? Terrain.Desert
                    : effectivePrecip < mapConstants.GRASS_BIOME_PRECIP_CUTOFF
                    ? Terrain.Grass
                    : effectivePrecip < mapConstants.WOOD_BIOME_PRECIP_CUTOFF
                    ? Terrain.Woods : Terrain.Forest;
        }
        return effectivePrecip > mapConstants.MOUNTAIN_BIOME_PRECIP_CUTOFF
                ? Terrain.MountainGrass : Terrain.MountainRock;
    }

    private deterMine(): void {
        if (this.terrain == Terrain.Desert && Math.random() < 0.01) {
            this.isMine = true;
        } else if (this.terrain == Terrain.MountainRock && Math.random() < 0.05) {
            this.isMine = true;
        } else if (this.terrain == Terrain.MountainGrass && Math.random() < 0.02) {
            this.isMine = true;
        } else if (this.terrain == Terrain.Grass && Math.random() < 0.005) {
            this.isMine = true;
        } else {
            this.isMine = false;
        }
    }
}
