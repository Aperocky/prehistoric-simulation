import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function strengthMod(person: Person): number {
    let woodMultiplier = 1;
    let ironMultiplier = 1;
    let consumed = person.work.workConsumption;
    if (ResourceType.Wood in consumed) {
        woodMultiplier += consumed[ResourceType.Wood] * 2;
    }
    if (ResourceType.Iron in consumed) {
        ironMultiplier += consumed[ResourceType.Iron] * 2;
    }
    let experience = 1 + person.work.experience["TOOL"]/10;
    return defaultAgeMod(person) * woodMultiplier * ironMultiplier * experience;
}


function produceFunc(strength: number, square: Square): number {
    let population = square.simInfo.people.length;
    let popFactor = 1;
    if (population > 50) {
        popFactor = (population/50) ** 0.4
        popFactor = popFactor > 3 ? 3 : popFactor
    }
    return strength * popFactor;
}


function changeFunc(person: Person, square: Square): string {
    let population = square.simInfo.people.length;
    if (population < 30 && Math.random() < 0.5) {
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
        if (population > 30 && Math.random() < 0.5) {
            return "TRAD";
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
