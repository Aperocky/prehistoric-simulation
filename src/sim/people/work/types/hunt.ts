import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


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

function changeFunc(person: Person, square: Square): string {
    if (square.isCoast) {
        if (person.isHungry()) {
            if (Math.random() < 0.6) {
                return "FISH";
            }
        } else {
            if (Math.random() < 0.2) {
                return "FISH";
            }
        }
    }
    if (square.simInfo.people.length > 50) {
        if (Math.random() < 0.25) {
            return "MEDS";
        }
    }
    if (person.isHungry()) {
        if (square.simInfo.people.length > 20 && Math.random() > 0.2) {
            return "TRAD";
        }
        if (square.simInfo.people.length > 40 && Math.random() > 0.5) {
            return "TRAD";
        }
        if (square.terrain == 3 || square.terrain == 7) {
            if (Math.random() < 0.5) {
                return "WOOD";
            }
        }
    }
    return "HUNT";
}

export const Gatherer: WorkType = {
    name: "Gatherer",
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
    searchdist: 4,
    workLocation: WorkLocation.Land,
    produceType: ResourceType.Food
}
