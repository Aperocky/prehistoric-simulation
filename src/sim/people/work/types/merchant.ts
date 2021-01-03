import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function changeFunc(person: Person, square: Square): string {
    let population = square.simInfo.people.length;
    if (person.isHungry()) {
        if (Math.random() < 0.2 && square.isCoast) {
            return "FISH";
        }
        if (Math.random() < 0.4) {
            return "HUNT";
        }
    }
    if (population < 30) {
        // Cities only
        if (square.isCoast) {
            return "FISH";
        } else {
            return "HUNT";
        }
    }
    if (person.household.stay > 5) {
        if (Math.random() < 0.1) {
            if (Math.random() < 0.5) {
                return "TOOL";
            } else {
                if (Math.random() < 0.5) {
                    return "HAUS";
                } else {
                    return "MEDS";
                }
            }
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
        return strength ** 1.4;
    },
    changeFunc: changeFunc,
    searchdist: 0,
    workLocation: WorkLocation.Land,
    produceType: ResourceType.Gold
}
