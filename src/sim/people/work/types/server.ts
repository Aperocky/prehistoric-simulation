import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function strengthMod(person: Person): number {
    return defaultAgeMod(person) * 2;
}


function produceFunc(strength: number, square: Square): number {
    let population = square.simInfo.people.length;
    let popFactor = 1;
    if (population > 50) {
        let popFactor = (population/50) ** 0.3;
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
    if (person.isHungry() && Math.random() < 0.2) {
        if (square.isCoast) {
            return "FISH";
        } else if (square.simInfo.farmerCount > 5) {
            return "FARM";
        } else {
            return "TRAD";
        }
    }
    return "SERV";
}


export const Server: WorkType = {
    name: "Server",
    consume: {},
    strengthMod: strengthMod,
    produceFunc: produceFunc,
    changeFunc: changeFunc,
    searchdist: 0,
    workLocation: WorkLocation.Private,
    produceType: ResourceType.Serv
}
