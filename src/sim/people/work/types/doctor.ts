import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function changeFunc(person: Person, square: Square): string {
    let population = square.simInfo.people.length;
    if (population < 30) {
        if (Math.random() < 0.25) {
            if (square.isCoast) {
                return "FISH";
            } else if (square.simInfo.farmerCount > 5) {
                return "FARM";
            } else {
                return "HUNT";
            }
        }
    }
    if (person.isHungry() && Math.random() < 0.25) {
        return "TRAD";
    }
    return "MEDS";
}


function strengthMod(person: Person): number {
    let woodMultiplier = 0.5;
    let consumed = person.work.workConsumption;
    if (ResourceType.Wood in consumed) {
        woodMultiplier += consumed[ResourceType.Wood] * 2;
    }
    let experience = 1 + person.work.experience["MEDS"]/10;
    return defaultAgeMod(person) * woodMultiplier;
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


export const Doctor: WorkType = {
    name: "Doctor",
    consume: {"wood": 1},
    strengthMod: strengthMod,
    produceFunc: produceFunc,
    changeFunc: changeFunc,
    searchdist: 0,
    workLocation: WorkLocation.Private,
    produceType: ResourceType.Meds
}
