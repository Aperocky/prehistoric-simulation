import { TEST_TERRAIN } from './util/locationTest';
import { Simulation } from '../../src/sim/sim';
import { INITIAL_PERSON_COUNT } from '../../src/constant/simConstants';
import { expect } from 'chai';

export const TEST_SIM = (() => {
    let sim = new Simulation(TEST_TERRAIN);
    sim.initialize(3);
    return sim;
})();

describe('simulation', () => {
    it('test initialization', () => {
        let sim = new Simulation(TEST_TERRAIN);
        sim.initialize(3);
        expect(sim.households.length).to.equal(3);
        expect(Object.keys(sim.people).length).to.equal(3);
    });

    it('test consumption', () => {
        let sim = new Simulation(TEST_TERRAIN);
        sim.initialize(5);
        sim.simProduction.globalWorkIteration(sim.people);
        expect(sim.households[0].storage.getResource("food")).to.be.gt(0);
        sim.consume();
        expect(sim.households[0].adults[0].consumption["food"]).to.be.gt(0);
    });
});

