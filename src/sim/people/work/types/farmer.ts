import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function farmTerrainCapacity(square: Square): number[] {
    // individual and exponent
    switch (square.terrain) {
        case 2: // Grass
            return [4, 0.6];
        case 6: // Highland
            return [3, 0.6];
        case 7: // Woods
            return [3, 0.7];
        default:
            return [0, 0];
    }
}


function produceFunc(strength: number, square: Square): number {
    let population = square.simInfo.people.length;
    let popFactor = 1;
    if (population > 50) {
        let popFactor = (population/50) ** 0.5;
    }
    return strength ** farmTerrainCapacity(square)[1] / popFactor * farmTerrainCapacity(square)[0];
}


function strengthMod(person: Person): number {
    let toolMultiplier = 1;
    let consumed = person.work.workConsumption;
    if (ResourceType.Tool in consumed) {
        toolMultiplier += consumed[ResourceType.Tool] * 2;
    }
    return defaultAgeMod(person) * toolMultiplier;
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
    }
    if (population > 50) {
        if (Math.random() < 0.2) {
            return "TOOL";
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
