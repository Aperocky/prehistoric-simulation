import move from '../../../../src/sim/people/actions/move';
import { Household } from '../../../../src/sim/people/household';
import { getSimulationOnTerrain } from '../../simTest';
import { expect } from 'chai';


describe('action:move', () => {
    
    let testSim = getSimulationOnTerrain();
    testSim.runTurn();

    it('test moving', () => {
        let household = testSim.households[0];
        let oldLocation = household.location;
        move(household, testSim.terrain);
        expect(household.location).to.not.equal(oldLocation);
    });
});
