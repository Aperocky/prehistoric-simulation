import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function changeFunc(person: Person, square: Square): string {
    if (!square.isCoast) {
        return "HUNT";
    }
    if (person.isHungry()) {
        if (square.simInfo.people.length > 20 && Math.random() > 0.2) {
            return "TRAD";
        }
        if (square.simInfo.people.length > 40 && Math.random() > 0.5) {
            return "TRAD";
        }
    }
    return "FISH";
}


function strengthMod(person: Person): number {
    let woodMultiplier = 0.5
    let consumed = person.work.workConsumption;
    if (ResourceType.Wood in consumed) {
        woodMultiplier += consumed[ResourceType.Wood] * 2;
    }
    return defaultAgeMod(person) * woodMultiplier * 4;
}

export const Fisher: WorkType = {
    name: "Fisher",
    consume: {"wood": 2},
    strengthMod: strengthMod,
    produceFunc: (strength, square) => {
        let depthMultiplier = 2 + square.altitude/500;
        return strength**0.6 * depthMultiplier;
    },
    changeFunc: changeFunc,
    searchdist: 7,
    workLocation: WorkLocation.Water,
    produceType: ResourceType.Food
}
