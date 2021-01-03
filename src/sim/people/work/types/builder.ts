import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function strengthMod(person: Person): number {
    let woodMultiplier = 1;
    let toolMultiplier = 1;
    let consumed = person.work.workConsumption;
    if (ResourceType.Wood in consumed) {
        woodMultiplier += consumed[ResourceType.Wood];
    }
    if (ResourceType.Iron in consumed) {
        toolMultiplier += consumed[ResourceType.Iron] * 2;
    }
    return defaultAgeMod(person) * woodMultiplier * toolMultiplier * 2;
}


function produceFunc(strength: number, square: Square): number {
    return strength;
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
    return "HAUS";
}


export const Builder: WorkType = {
    name: "Builder",
    consume: {"wood": 2, "tool": 1},
    strengthMod: strengthMod,
    produceFunc: produceFunc,
    changeFunc: changeFunc,
    searchdist: 0,
    workLocation: WorkLocation.Private,
    produceType: ResourceType.Haus
}
