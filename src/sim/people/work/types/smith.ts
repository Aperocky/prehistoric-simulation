import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function strengthMod(person: Person): number {
    let woodMultiplier = 1;
    let ironMultiplier = 1;
    let consumed = person.work.workConsumption;
    if (ResourceType.Tool in consumed) {
        woodMultiplier += consumed[ResourceType.Tool] * 2;
    }
    if (ResourceType.Iron in consumed) {
        ironMultiplier += consumed[ResourceType.Iron] * 2;
    }
    return defaultAgeMod(person) * woodMultiplier * ironMultiplier;
}


function produceFunc(strength: number, square: Square): number {
    let population = square.simInfo.people.length;
    let popFactor = 1;
    if (population > 50) {
        let popFactor = (population/50) ** 0.5;
    }
    return strength * 2 * popFactor;
}


function changeFunc(person: Person, square: Square): string {
    let population = square.simInfo.people.length;
    if (population < 40 && Math.random() < 0.5) {
        if (square.isCoast) {
            return "FISH";
        } else if ([3, 7].includes(square.terrain)) {
            return "WOOD";
        } else if (square.simInfo.farmerCount > 5) {
            return "FARM";
        } else {
            return "HUNT";
        }
    }
    if (person.isHungry()) {
        if (population > 40) {
            if (Math.random() < (population ** 0.5 * 0.05)) {
                return "TRAD";
            }
        }
    }
    return "TOOL";
}


export const Smith: WorkType = {
    name: "Smith",
    consume: {"wood": 1, "iron": 1},
    strengthMod: strengthMod,
    produceFunc: produceFunc,
    changeFunc: changeFunc,
    searchdist: 4,
    workLocation: WorkLocation.Private,
    produceType: ResourceType.Tool
}
