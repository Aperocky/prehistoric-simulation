import { Simulation } from '../sim';
import { Square } from '../../map/square';
import { Location, getRandomLandLocations } from './location';
import { Heritage, initialHeritage } from '../people/properties/heritage';
import { Household } from '../people/household';
import { Person } from '../people/person';
import { INITIAL_AGE } from '../../constant/simConstants';


export default function initializeSim(sim: Simulation, population: number): void {
    let initialLocations = getRandomLandLocations(sim.terrain, population);
    initialLocations.map(loc => {
        let person = new Person(initialHeritage());
        sim.people.set(person.id, person);
        person.age = INITIAL_AGE[0] + Math.floor(Math.random()
                * (INITIAL_AGE[1] - INITIAL_AGE[0]));
        let household = new Household([], person, loc);
        sim.households.set(household.id, household);
    })
}
