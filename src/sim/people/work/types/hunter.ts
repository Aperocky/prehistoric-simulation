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
    let population = square.simInfo.people.length;
    if (square.isCoast) {
        if (person.isHungry()) {
            if (Math.random() < 0.6) {
                return "FISH";
            }
        } else {
            if (Math.random() < 0.1) {
                return "FISH";
            }
        }
    }
    if (population > 30) {
        if (Math.random() < 0.3) {
            return "TRAD";
        }
        if (Math.random() < 0.1) {
            return "SERV";
        }
    }
    if (person.household.stay > 10 && population < 25) {
        if (Math.random() < 0.05) {
            return "FARM";
        }
    }
    if (square.terrain == 3 && Math.random() < 0.1) {
        return "WOOD";
    }
    return "HUNT";
}


function produceFunc(strength: number, square: Square): number {
    // Farmers don't like nomads
    let farmerCount = square.simInfo.farmerCount;
    let farmFactor = 1;
    if (farmerCount > 0) {
        farmFactor -= farmerCount * 0.2;
        farmFactor = farmFactor < 0.1 ? 0.1 : farmFactor;
    }
    let capacity: number[] = gathererTerrainCapacity(square);
    let produce = strength * capacity[0] * farmFactor;
    if (produce > capacity[1]) {
        return capacity[1];
    }
    return produce;
}


export const Gatherer: WorkType = {
    name: "Gatherer",
    consume: {},
    strengthMod: (person) => {
        return defaultAgeMod(person);
    },
    produceFunc: produceFunc,
    changeFunc: changeFunc,
    searchdist: 4,
    workLocation: WorkLocation.Land,
    produceType: ResourceType.Food
}
