import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function farmTerrainCapacity(square: Square): number[] {
    // individual and exponent
    switch (square.terrain) {
        case 2: // Grass
            return [2, 0.6];
        case 6: // Highland
            return [1.5, 0.6];
        case 7: // Woods
            return [1.5, 0.7];
        default:
            return [0, 0];
    }
}


function produceFunc(strength: number, square: Square): number {
    let population = square.simInfo.people.length;
    let popFactor = 1;
    if (population > 50) {
        let popFactor = (population/50);
    }
    let result = strength ** farmTerrainCapacity(square)[1] / popFactor * farmTerrainCapacity(square)[0];
    result *= square.simInfo.isFarm ? 1.2 : 1;
    result *= square.isRiver() ? 1.25 : 1;
    return result;
}


function strengthMod(person: Person): number {
    let toolMultiplier = 1;
    let consumed = person.work.workConsumption;
    if (ResourceType.Tool in consumed) {
        toolMultiplier += consumed[ResourceType.Tool] * 2;
    }
    let experience = person.work.experience["FARM"]/20;
    return defaultAgeMod(person) * toolMultiplier + experience;
}


function changeFunc(person: Person, square: Square): string {
    let population = square.simInfo.people.length;
    if (![2, 6, 7].includes(square.terrain)) {
        if (square.isCoast) {
            return "FISH";
        } else if (square.terrain == 3) {
            return "WOOD";
        } else {
            return "HUNT";
        }
    }
    if (person.isHungry()) {
        if (Math.random() < 0.05) {
            return "HUNT";
        }
        if (population > 50 && Math.random() < 0.05) {
            return "TRAD";
        }
    }
    if (population > 100) {
        if (Math.random() < 0.2) {
            return "TRAD";
        }
    }
    return "FARM";
}


export const Farmer: WorkType = {
    name: "Farmer",
    consume: {"tool": 1},
    strengthMod: strengthMod,
    produceFunc: produceFunc,
    changeFunc: changeFunc,
    searchdist: 0,
    workLocation: WorkLocation.Land,
    produceType: ResourceType.Food
}
