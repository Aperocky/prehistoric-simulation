import { Simulation } from '../sim';
import { Location, locationToString } from './location';

// Optimistically generated density map
export class DensityMap {

    turn: number;
    households: Map<string, number>;
    people: Map<string, number>;

    constructor(sim: Simulation) {
        this.turn = sim.turn;
    }

    updateChecker(sim: Simulation): boolean {
        return this.turn !== sim.turn;
    }

    getPopulationOfSquare(sim: Simulation, locstr: string): number {
        if (this.updateChecker(sim)) {
            this.syncSim(sim);
        }
        if (this.people.has(locstr)) {
            return this.people.get(locstr);
        }
        return 0;
    }

    syncSim(sim: Simulation) {
        this.households = new Map();
        this.people = new Map();
        sim.households.forEach(hh => {
            let locstr = locationToString(hh.location);
            if (this.households.has(locstr)) {
                this.households.set(locstr, this.households.get(locstr) + 1);
                this.people.set(locstr, this.people.get(locstr) + hh.totalPersons());
            } else {
                this.households.set(locstr, 1);
                if (this.people.has(locstr)) {
                    throw new Error("people populated before households");
                }
                this.people.set(locstr, hh.totalPersons());
            }
        });
        this.turn = sim.turn;
    }
}
