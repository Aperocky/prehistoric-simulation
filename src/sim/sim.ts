import { Household } from './people/household';
import { Person } from './people/person';
import { SimProduction } from './util/simProduction';
import { Square } from '../map/square';
import initializeSim from './util/initializeSim';
import { INITIAL_PERSON_COUNT } from '../constant/simConstants';


export class Simulation {

    turn: number;
    households: Household[];
    people: { [id: string]: Person };
    simProduction: SimProduction;
    readonly terrain: Square[][];

    constructor(terrain: Square[][]) {
        this.turn = 0;
        this.terrain = terrain;
        this.people = {};
        this.households = [];
        this.simProduction = new SimProduction(terrain);
    }

    initialize(count: number = INITIAL_PERSON_COUNT): void {
        initializeSim(this, this.terrain, count);
    }

    runTurn(): void {
        // Work iteration - get produce to bank.
        this.simProduction.globalWorkIteration(this.people);
        // Consume iteration - consume stuff
        this.consume();
    }

    consume(): void {
        this.households.forEach(hh => {
            hh.getProjectedConsumption();
            hh.consume();
        });
    }
}
