import { Person } from '../person';
import { ResourceType } from '../properties/resourceTypes';
import { Square } from '../../../map/square';

export enum WorkLocation {
    Land = "land",
    Water = "water",
    Private = "private"
}

export type WorkType = {
    name: string;
    consume: { [resourceType: string] : number };
    strengthMod: (consumed: {[res: string]: number}, person: Person) => number;
    produceFunc: (strength: number, square: Square) => number;
    searchdist: number;
    workLocation: string;
    produceType: ResourceType;
}

function defaultAgeMod(person: Person): number {
    if (person.age < 10) {
        return 0;
    }
    if (person.age < 18) {
        return (person.age - 8) * 0.1;
    }
    if (person.age > 50) {
        return 1 - (person.age - 50) * 0.02;
    }
    return 1;
}

function gathererTerrainCapacity(square: Square): number[] {
    // individual and cap
    switch (square.terrain) {
        case 2: // Grass
            return [4, 8];
        case 3: // Forest
            return [2, 10];
        case 4: // Mountain
            return [2, 4];
        case 5: // Desert
            return [1, 3];
        case 6: // Highland
            return [3, 6];
        case 7: // Woods
            return [3, 12];
        default:
            return [0, 0];
    }
}

const Gatherer: WorkType = {
    name: "Gatherer",
    consume: {},
    strengthMod: (consumed, person) => {
        return defaultAgeMod(person);
    },
    produceFunc: (strength, square) => {
        let capacity: number[] = gathererTerrainCapacity(square);
        let produce = strength * capacity[0];
        if (produce > strength * capacity[1]) {
            return capacity[1];
        }
        return produce;
    },
    searchdist: 5,
    workLocation: WorkLocation.Land,
    produceType: ResourceType.Food
}

const Fisher: WorkType = {
    name: "Fisher",
    consume: {"wood": 0.3},
    strengthMod: (consumed, person) => {
        let woodMultiplier = 0.5
        if (ResourceType.Wood in consumed) {
            return (0.1 - consumed[ResourceType.Wood])/0.2 + 0.5;
        }
        return defaultAgeMod(person) * woodMultiplier;
    },
    produceFunc: (strength, square) => {
        let depthMultiplier = 2 + square.altitude/500;
        return Math.sqrt(strength) * depthMultiplier;
    },
    searchdist: 3,
    workLocation: WorkLocation.Water,
    produceType: ResourceType.Food
}

export const WORK_TYPES: { [workType: string]: WorkType } = {
    HUNT: Gatherer,
    FISH: Fisher,
}
