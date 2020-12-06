import { Storage } from '../../../../src/sim/people/properties/storage';
import { ResourceType } from '../../../../src/sim/people/properties/resourceTypes';
import { Work } from '../../../../src/sim/people/work/work';
import { expect } from 'chai';
import { TEST_SIM } from '../../simTest';
import { Person } from '../../../../src/sim/people/person';
import { Household } from '../../../../src/sim/people/household';
import { SquareProduction } from '../../../../src/sim/util/squareProduction';


describe('storage', () => {
    it('test basic populate work', () => {
        let household: Household = TEST_SIM.households[0];
        household.work(TEST_SIM.simProduction);
        let prodCells: SquareProduction[] = [].concat(...TEST_SIM.simProduction.board);
        let sumWork: number = prodCells.map(c => c.getStrength("HUNT")).reduce((a, b) => a + b, 0);
        expect(sumWork > 0).to.be.true;
        TEST_SIM.simProduction.reset();
    });
});
