import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';


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

export const Gatherer: WorkType = {
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
    searchdist: 4,
    workLocation: WorkLocation.Land,
    produceType: ResourceType.Food
}
