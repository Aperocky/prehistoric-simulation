import { Storage } from '../../../../src/sim/people/properties/storage';
import { ResourceType } from '../../../../src/sim/people/properties/resourceTypes';
import { Work } from '../../../../src/sim/people/work/work';
import { expect } from 'chai';
import { TEST_SIM } from '../../simTest';
import { Person } from '../../../../src/sim/people/person';
import { Household } from '../../../../src/sim/people/household';
import { SquareProduction } from '../../../../src/sim/util/squareProduction';
import { WILL_TURNER } from '../personTest';


describe('people:work', () => {
    it('test basic populate work', () => {
        let household: Household = TEST_SIM.households.values().next().value;
        let person = household.adults[0]
        expect(person.work.workLocation).to.be.null;
        person.work.doWork(TEST_SIM.simProduction);
        expect(person.work.workLocation).to.not.be.null;
        let wl = person.work.workLocation;
        let sqp = TEST_SIM.simProduction.board[wl.y][wl.x];
        expect(sqp.getStrength("HUNT") > 0).to.be.true;
        // cleanup
        TEST_SIM.simProduction.reset();
    });

    it('test work compensation', () => {
        let household: Household = TEST_SIM.households.values().next().value;
        let person = household.adults[0]
        person.work.doWork(TEST_SIM.simProduction);
        TEST_SIM.simProduction.calculate();
        let justThisPerson = new Map();
        justThisPerson.set(person.id, person);
        TEST_SIM.simProduction.distribute(justThisPerson);
        expect(person.work.produce > 0).to.be.true;
        expect(person.household.storage.getResource("food")).to.be.gt(0);
        // cleanup
        person.work.produce = 0;
        person.household.storage = new Storage();
        TEST_SIM.simProduction.reset();
    });

    it('test populate work consumption', () => {
        WILL_TURNER.work.work = "FISH";
        expect(WILL_TURNER.consumption).to.be.empty;
        let consumption = {"food": 1, "wood": 1};
        WILL_TURNER.work.populateWorkConsumption(consumption);
        expect(WILL_TURNER.work.workConsumption).to.deep.equal({"wood": 1});

        consumption = {"food": 1, "wood": 3};
        WILL_TURNER.work.populateWorkConsumption(consumption);
        expect(WILL_TURNER.work.workConsumption).to.deep.equal({"wood": 2});

        let onlyFood = {"food": 1};
        WILL_TURNER.work.populateWorkConsumption(onlyFood);
        expect(WILL_TURNER.work.workConsumption).to.be.empty;
        // Cleanup
        WILL_TURNER.work.work = "HUNT";
        WILL_TURNER.work.workConsumption = {};
    });
});
