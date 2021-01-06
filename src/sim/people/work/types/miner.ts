import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function strengthMod(person: Person): number {
    let toolMultiplier = 1;
    let consumed = person.work.workConsumption;
    if (ResourceType.Tool in consumed) {
        toolMultiplier += consumed[ResourceType.Tool] * 2;
    }
    let experience = 1 + person.work.experience["MINE"]/20;
    return defaultAgeMod(person) * toolMultiplier * experience;
}


function produceFunc(strength: number, square: Square): number {
    return strength ** 0.8;
}


function changeFunc(person: Person, square: Square): string {
    if (!square.isMine || (person.isHungry() && Math.random() < 0.3)) {
        if (square.isCoast) {
            return "FISH";
        } else if ([3, 7].includes(square.terrain)) {
            return "WOOD";
        } else {
            return "HUNT";
        }
    }
    return "MINE";
}


export const Miner: WorkType = {
    name: "Miner",
    consume: {"tool": 2},
    strengthMod: strengthMod,
    produceFunc: produceFunc,
    changeFunc: changeFunc,
    searchdist: 0,
    workLocation: WorkLocation.Land,
    produceType: ResourceType.Iron
}
