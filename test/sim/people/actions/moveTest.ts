import move from '../../../../src/sim/people/actions/move';
import { Household } from '../../../../src/sim/people/household';
import { getSimulationOnTerrain } from '../../simTest';
import { expect } from 'chai';


describe('people:move', () => {

    let testSim = getSimulationOnTerrain();
    testSim.runTurn();

    it('test moving', () => {
        let household = testSim.households.values().next().value;
        household.percentSatisfied["food"] = 1;
        let oldLocation = household.location;
        let iteration = 0;
        while (true) {
            move(household, testSim.terrain);
            if (household.location != oldLocation) {
                break;
            }
            iteration++;
            if (iteration > 5) {
                throw new Error("Should move");
            }
        }
        // cleanup
        household.stay = 0;
        household.percentSatisfied = {}
    });

    it('moving leaves house', () => {
        let household = testSim.households.values().next().value;
        household.percentSatisfied["food"] = 1;
        household.storage.storage["housing"] = 5;
        let oldLocation = household.location;
        let iteration = 0;
        while (true) {
            move(household, testSim.terrain);
            if (household.location != oldLocation) {
                expect(household.storage.getResource("housing")).to.equal(0);
                break;
            } else {
                expect(household.storage.getResource("housing")).to.equal(5);
            }
            iteration++;
            if (iteration > 100) {
                throw new Error("Should move");
            }
        }
        // cleanup
        household.stay = 0;
        household.percentSatisfied = {}
    });

    it('test not moving', () => {
        let household = testSim.households.values().next().value;
        expect(household.stay).to.equal(0);
        household.percentSatisfied["food"] = 1;
        household.adults[0].work.work = "WOOD";
        let oldLocation = household.location;
        move(household, testSim.terrain);
        expect(household.location).to.equal(oldLocation);
        expect(household.stay).to.equal(1);
        // cleanup
        household.percentSatisfied = {}
        household.stay = 0;
        household.adults[0].work.work = "HUNT";
    });
});
