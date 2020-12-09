import { TEST_TERRAIN } from './util/locationTest';
import { Simulation } from '../../src/sim/sim';
import { Square } from '../../src/map/square';
import { INITIAL_PERSON_COUNT } from '../../src/constant/simConstants';
import generateTerrain from '../../src/map/generateTerrain';
import { expect } from 'chai';

export const TEST_SIM = (() => {
    let sim = new Simulation(TEST_TERRAIN);
    sim.initialize(3);
    return sim;
})();

export function getSimulationOnTerrain(): Simulation {
    let terrain: Square[][];
    let count = 0;
    while (count < 10) {
        terrain = generateTerrain(20);
        if ([].concat(...terrain).filter(s => !s.isWater()).length > 100) {
            break;
        }
        count++;
    }
    let sim = new Simulation(terrain);
    sim.initialize(20);
    return sim;
}

describe('sim:simulation', () => {

    let largeSim = getSimulationOnTerrain();

    it('test initialization', () => {
        let sim = new Simulation(TEST_TERRAIN);
        sim.initialize(3);
        expect(sim.households.size).to.equal(3);
        expect(sim.people.size).to.equal(3);
    });

    it('test consumption', () => {
        let sim = new Simulation(TEST_TERRAIN);
        sim.initialize(5);
        sim.simProduction.globalWorkIteration(sim.people);
        expect(sim.households.values().next().value.storage.getResource("food")).to.be.gt(0);
        sim.consume();
        expect(sim.households.values().next().value.adults[0].consumption["food"]).to.be.gt(0);
    });

    it('test runTurn', () => {
        let turn = 0;
        while (turn < 5) {
            largeSim.runTurn();
            turn++;
        }
    });
});

