import move from '../../../../src/sim/people/actions/move';
import { Household } from '../../../../src/sim/people/household';
import { getSimulationOnTerrain } from '../../simTest';
import { expect } from 'chai';


describe('people:move', () => {

    it('test moving', () => {
        let iteration = 0;
        while (true) {
            let sim = getSimulationOnTerrain();
            let household = sim.households.values().next().value;
            household.percentSatisfied["food"] = 1;
            let oldLocation = household.location;
            move(household, sim.terrain);
            if (household.location != oldLocation) {
                break;
            }
            iteration++;
            if (iteration > 5) {
                throw new Error("Should move");
            }
        }
    });

    it('moving leaves house', () => {
        let iteration = 0;
        while (true) {
            let sim = getSimulationOnTerrain();
            let household = sim.households.values().next().value;
            household.percentSatisfied["food"] = 1;
            household.storage.storage["housing"] = 5;
            let oldLocation = household.location;
            move(household, sim.terrain);
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
    });

    it('test not moving', () => {
        let sim = getSimulationOnTerrain();
        let household = sim.households.values().next().value;
        expect(household.stay).to.equal(0);
        household.percentSatisfied["food"] = 1;
        household.adults[0].work.work = "WOOD";
        let oldLocation = household.location;
        move(household, sim.terrain);
        expect(household.location).to.equal(oldLocation);
        expect(household.stay).to.equal(1);
        // cleanup
        household.percentSatisfied = {}
        household.stay = 0;
        household.adults[0].work.work = "HUNT";
    });
});
