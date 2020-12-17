import { Household } from '../sim/people/household';
import { Person } from '../sim/people/person';

// Sim data storge in each square
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
