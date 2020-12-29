import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function gathererTerrainCapacity(square: Square): number[] {
    // individual and cap
    switch (square.terrain) {
        case 2: // Grass
            return [1, 2];
        case 3: // Forest
            return [2, 10];
        case 7: // Woods
            return [3, 6];
        default:
            return [0, 0];
    }
}


function changeFunc(person: Person, square: Square): string {
    if (![2, 3, 7].includes(square.terrain)) {
        return "HUNT";
    }
    if (person.isHungry()) {
        if (Math.random() < 0.5) {
            return "HUNT"
        }
    }
    return "WOOD";
}


export const Lumberjack: WorkType = {
    name: "Lumberjack",
    consume: {},
    strengthMod: (person) => {
        return defaultAgeMod(person);
    },
    produceFunc: (strength, square) => {
        let capacity: number[] = gathererTerrainCapacity(square);
        let produce = strength * capacity[0];
        if (produce > capacity[1]) {
            return capacity[1];
        }
        return produce;
    },
    changeFunc: changeFunc,
    searchdist: 0,
    workLocation: WorkLocation.Land,
    produceType: ResourceType.Wood
}
