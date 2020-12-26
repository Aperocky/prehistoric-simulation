import { Household } from '../sim/people/household';
import { Person } from '../sim/people/person';

// Sim data storage in each square
export type SimSquare = {
    cleared: boolean;
    households: Household[];
    people: Person[];
}

export function initSimInfo(): SimSquare {
    return {
        cleared: false,
        households: [],
        people: []
    };
}

export function getHealth(sim: SimSquare): number {
    if (sim.people.length) {
        let totalHealth = 0;
        let adults = 0;
        sim.people.forEach(p => {
            if (p.age >= 14) {
                adults++;
                totalHealth += p.health;
            }
        });
        if (adults) {
            return totalHealth/adults;
        }
    }
    return 0;
}

export function getAge(sim: SimSquare): number {
    if (sim.people.length) {
        let totalAge = 0;
        sim.people.forEach(p => { totalAge += p.age; });
        return totalAge/sim.people.length;
    }
    return 0;
}
