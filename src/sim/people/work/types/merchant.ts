import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function changeFunc(person: Person, square: Square): string {
    let population = square.simInfo.people.length;
    if (population < 30) {
        // Cities only
        if (square.isCoast) {
            return "FISH";
        } else {
            return "HUNT";
        }
    }
    if (person.isHungry() && Math.random() < 0.5) {
        return "SERV";
    }
    if (person.household.stay > 5) {
        if (Math.random() < 0.1 && population > 50) {
            if (Math.random() < 0.5) {
                return "TOOL";
            } else {
                return "HAUS";
            }
        }
        if (population > 100 && Math.random() < 0.05) {
            return "MEDS";
        }
    }
    return "TRAD";
}


function produceFunc(strength: number, square: Square): number {
    let tradingBlock = square.simInfo.traderCount;
    let tradingBoost = 1;
    if (tradingBlock) {
        tradingBoost = tradingBlock ** 0.3
        tradingBoost = tradingBoost > 5 ? 5 : tradingBoost;
    }
    return strength * tradingBoost;
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
    workLocation: WorkLocation.Private,
    produceType: ResourceType.Gold
}
