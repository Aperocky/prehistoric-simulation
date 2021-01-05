import { Household } from '../sim/people/household';
import { Person } from '../sim/people/person';


// Sim data storage in each square
export type SimSquare = {
    cleared: boolean;
    households: Household[];
    people: Person[];
    farmerCount: number;
    isFarm: boolean;
}


export function initSimInfo(): SimSquare {
    return {
        cleared: false,
        households: [],
        people: [],
        farmerCount: 0,
        isFarm: false
    };
}


export function getHealth(simSquare: SimSquare): number {
    if (simSquare.people.length) {
        let adults = simSquare.people.filter(p => p.age >= 14)
        if (adults.length) {
            return adults.reduce((sum, p) => sum + p.health, 0) / adults.length;
        }
    }
    return 0;
}
