import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function woodTerrainCapacity(square: Square): number[] {
    // individual and cap
    switch (square.terrain) {
        case 2: // Grass
            return [2, 4];
        case 3: // Forest
            return [5, 30];
        case 7: // Woods
            return [4, 12];
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


function strengthMod(person: Person): number {
    let toolMultiplier = 1
    let consumed = person.work.workConsumption;
    if (ResourceType.Tool in consumed) {
        toolMultiplier += consumed[ResourceType.Tool] * 2;
    }
    return defaultAgeMod(person) * toolMultiplier;
}


export const Lumberjack: WorkType = {
    name: "Lumberjack",
    consume: {"tool": 2},
    strengthMod: strengthMod,
    produceFunc: (strength, square) => {
        let capacity: number[] = woodTerrainCapacity(square);
        let produce = strength * capacity[0];
        if (produce > capacity[1]) {
            return capacity[1];
        }
        if (square.simInfo.isFarm) {
            produce *= 0.5;
        }
        return produce;
    },
    changeFunc: changeFunc,
    searchdist: 0,
    workLocation: WorkLocation.Land,
    produceType: ResourceType.Wood
}
