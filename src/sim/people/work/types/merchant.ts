import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function changeFunc(person: Person, square: Square): string {
    let population = square.simInfo.people.length;
    if (population < 50) {
        // Cities only
        if (square.isCoast) {
            return "FISH";
        } else if (square.simInfo.farmerCount > 5) {
            return "FARM";
        } else {
            return "HUNT";
        }
    }
    if (person.isHungry() && Math.random() < 0.5) {
        if (square.simInfo.farmerCount > 10 && population < 100) {
            return "FARM";
        } else {
            return "SERV";
        }
    }
    if (person.household.stay > 10) {
        if (Math.random() < 0.04) {
            if (Math.random() < 0.5) {
                return "TOOL";
            } else {
                return "HAUS";
            }
        }
        if (population > 100 && Math.random() < 0.02) {
            return "MEDS";
        }
    }
    return "TRAD";
}


function produceFunc(strength: number, square: Square): number {
    let exponent = 1.2;
    exponent += square.isCoast ? 0.05 : 0;
    exponent += square.isRiver()
            ? (square.flowVolume < 10
            ? 0.05
            : square.flowVolume < 20
            ? 0.1 : 0.2)
            : 0;
    // local bonus
    let baseBonus = square.simInfo.people.length * 2;
    baseBonus = baseBonus > 400 ? 400 : baseBonus;
    return strength ** exponent + baseBonus;
}


function strengthMod(person: Person): number {
    let experience = 2 + person.work.experience["TRAD"]/10;
    return defaultAgeMod(person) * experience;
}


export const Trader: WorkType = {
    name: "Merchant",
    consume: {},
    strengthMod: (person) => {
        let ageMultiplier = person.age < 40 ? person.age/10 : 4;
        return defaultAgeMod(person) * ageMultiplier;
    },
    produceFunc: produceFunc,
    changeFunc: changeFunc,
    searchdist: 0,
    workLocation: WorkLocation.Land,
    produceType: ResourceType.Gold
}
