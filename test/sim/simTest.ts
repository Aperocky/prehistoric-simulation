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
});

