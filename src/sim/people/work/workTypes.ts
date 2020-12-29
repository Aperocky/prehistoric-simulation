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
    strengthMod: (person: Person) => number;
    produceFunc: (strength: number, square: Square) => number;
    changeFunc: (person: Person, square: Square) => string;
    searchdist: number;
    workLocation: string;
    produceType: ResourceType;
}

export function defaultAgeMod(person: Person): number {
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

import { Gatherer } from './types/hunt';
import { Fisher } from './types/fish';
import { Trader } from './types/merchant';
import { Lumberjack } from './types/lumberjack';

export const WORK_TYPES: { [workType: string]: WorkType } = {
    HUNT: Gatherer,
    FISH: Fisher,
    TRAD: Trader,
    WOOD: Lumberjack,
}
