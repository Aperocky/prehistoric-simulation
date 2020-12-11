import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';


function gathererTerrainCapacity(square: Square): number[] {
    // individual and cap
    switch (square.terrain) {
        case 2: // Grass
            return [4, 6];
        case 3: // Forest
            return [2, 8];
        case 4: // Mountain
            return [2, 4];
        case 5: // Desert
            return [1, 2];
        case 6: // Highland
            return [2.5, 5];
        case 7: // Woods
            return [3, 10];
        default:
            return [0, 0];
    }
}

export const Gatherer: WorkType = {
    name: "Gatherer",
    consume: {},
    strengthMod: (consumed, person) => {
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
    searchdist: 4,
    workLocation: WorkLocation.Land,
    produceType: ResourceType.Food
}
