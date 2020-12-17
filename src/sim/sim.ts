import { Household } from './people/household';
import { Person } from './people/person';
import { SimProduction } from './util/simProduction';
import { Square } from '../map/square';
import initializeSim from './util/initializeSim';
import matchingService from './util/matchingService';
import populateSquareInfo from './util/populateSquareInfo';
import { INITIAL_PERSON_COUNT } from '../constant/simConstants';


export class Simulation {

    turn: number;
    households: Map<string, Household>;
    people: Map<string, Person>;
    simProduction: SimProduction;
    readonly terrain: Square[][];


    constructor(terrain: Square[][]) {
        this.turn = 0;
        this.terrain = terrain;
        this.people = new Map();
        this.households = new Map();
        this.simProduction = new SimProduction(terrain);
    }

    initialize(count: number = INITIAL_PERSON_COUNT): void {
        initializeSim(this, count);
        populateSquareInfo(this);
    }

    runTurn(): void {
        this.allDo(hh => hh.changeWork(this));
        // Work iteration - get produce to bank.
        this.simProduction.globalWorkIteration(this.people);
        // Match Singles!
        matchingService(this);
        // Consume iteration - consume stuff
        this.consume();
        // Run turn for each household.
        this.allDo(hh => hh.runTurn(this));
        this.turn++;
        // populate readonly square info
        populateSquareInfo(this);
    }

    consume(): void {
        this.allDo(hh => {
            hh.getProjectedConsumption();
            hh.consume();
        });
    }

    private allDo(func: (hh: Household) => void) {
        this.households.forEach(func);
    }
}
