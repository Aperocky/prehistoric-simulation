import { Household } from './people/household';
import { Person } from './people/person';
import { SimProduction } from './util/simProduction';
import { SimMarket } from './market/simMarket';
import { Square } from '../map/square';
import initializeSim from './util/initializeSim';
import matchingService from './util/matchingService';
import populateSquareInfo from './util/populateSquareInfo';
import { INITIAL_PERSON_COUNT, BACKGROUND_GOLD, INFLATION } from '../constant/simConstants';


export class Simulation {

    turn: number;
    households: Map<string, Household>;
    people: Map<string, Person>;
    simProduction: SimProduction;
    simMarket: SimMarket;
    readonly terrain: Square[][];


    constructor(terrain: Square[][]) {
        this.turn = 0;
        this.terrain = terrain;
        this.people = new Map();
        this.households = new Map();
        this.simProduction = new SimProduction(terrain);
        this.simMarket = new SimMarket();
    }

    initialize(count: number = INITIAL_PERSON_COUNT): void {
        initializeSim(this, count);
        populateSquareInfo(this);
    }

    runTurn(): void {
        this.allDo(hh => hh.changeWork(this));
        // Work iteration - get produce to bank.
        this.simProduction.globalWorkIteration(this.people);
        // slow natural discovery of precious metal
        this.allDo(hh => hh.storage.addGold(BACKGROUND_GOLD));
        // Match Singles!
        matchingService(this);
        // Consume iteration - consume stuff
        this.allDo(hh => hh.getProjectedConsumption());
        // Shop on market
        this.simMarket.run(Array.from(this.households.values()));
        this.allDo(hh => hh.consume());
        // Run turn for each household.
        this.allDo(hh => hh.runTurn(this));
        // Inflation
        this.allDo(hh => hh.storage.spendGold(hh.storage.gold * INFLATION));
        this.turn++;
        // populate readonly square info
        populateSquareInfo(this);
    }

    allDo(func: (hh: Household) => void) {
        this.households.forEach(func);
    }
}
