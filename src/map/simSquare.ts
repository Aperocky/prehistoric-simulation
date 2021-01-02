import { Household } from '../sim/people/household';
import { Person } from '../sim/people/person';


// Sim data storage in each square
export type SimSquare = {
    cleared: boolean;
    households: Household[];
    people: Person[];
    farmerCount: number;
}


export function initSimInfo(): SimSquare {
    return {
        cleared: false,
        households: [],
        people: [],
        farmerCount: 0
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


export function getAge(simSquare: SimSquare): number {
    if (simSquare.people.length) {
        return simSquare.people.reduce((sum, p) => sum + p.health, 0) / simSquare.people.length;
    }
    return 0;
}
