import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function changeFunc(person: Person, square: Square): string {
    let population = square.simInfo.people.length;
    if (!square.isCoast) {
        return "HUNT";
    }
    if (person.isHungry()) {
        if (population > 50 && Math.random() < 0.5) {
            return "TRAD";
        }
        if (Math.random() < 0.2) {
            return "HUNT";
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
    let experience = 2 + person.work.experience["FISH"]/10;
    return defaultAgeMod(person) * woodMultiplier * experience;
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
    searchdist: 8,
    workLocation: WorkLocation.Water,
    produceType: ResourceType.Food
}
