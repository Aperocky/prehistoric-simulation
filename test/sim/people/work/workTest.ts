import { Storage } from '../../../../src/sim/people/properties/storage';
import { ResourceType } from '../../../../src/sim/people/properties/resourceTypes';
import { Work } from '../../../../src/sim/people/work/work';
import { expect } from 'chai';
import { TEST_SIM } from '../../simTest';
import { Person } from '../../../../src/sim/people/person';
import { Household } from '../../../../src/sim/people/household';
import { SquareProduction } from '../../../../src/sim/util/squareProduction';


describe('work', () => {
    it('test basic populate work', () => {
        let household: Household = TEST_SIM.households[0];
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
        let household: Household = TEST_SIM.households[0];
        let person = household.adults[0]
        person.work.doWork(TEST_SIM.simProduction);
        TEST_SIM.simProduction.calculate();
        let justThisPerson = {}
        justThisPerson[person.id] = person;
        TEST_SIM.simProduction.distribute(justThisPerson);
        expect(person.work.produce > 0).to.be.true;
        expect(person.household.storage.getResource("food")).to.be.gt(0);
        // cleanup
        person.work.produce = 0;
        person.household.storage = new Storage();
        TEST_SIM.simProduction.reset();
    });
});
