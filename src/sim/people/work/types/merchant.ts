import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function changeFunc(person: Person, square: Square): string {
    if (person.isHungry()) {
        if (Math.random() < 0.2 && square.isCoast) {
            return "FISH";
        }
        if (Math.random() < 0.4) {
            return "HUNT";
        }
    }
    if (square.simInfo.people.length < 20 && Math.random() > 0.8) {
        // Cities only
        if (square.isCoast) {
            return "FISH";
        } else {
            return "HUNT";
        }
    }
    return "TRAD";
}


export const Trader: WorkType = {
    name: "Merchant",
    consume: {},
    strengthMod: (person) => {
        let ageMultiplier = person.age < 40 ? person.age/10 : 4;
        return defaultAgeMod(person) * ageMultiplier;
    },
    produceFunc: (strength, square) => {
        return strength ** 1.25;
    },
    changeFunc: changeFunc,
    searchdist: 0,
    workLocation: WorkLocation.Land,
    produceType: ResourceType.Gold
}
