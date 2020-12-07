import { SquareProduction } from '../../../src/sim/util/squareProduction';
import { SimProduction } from '../../../src/sim/util/simProduction';
import { Square } from '../../../src/map/square';
import { TEST_SIM } from '../simTest';
import { expect } from 'chai';


describe('simProduction', () => {
    it('test simProduction', () => {
        Object.values(TEST_SIM.people).map(p => {
            p.work.doWork(TEST_SIM.simProduction);
        });
        TEST_SIM.simProduction.calculate();
        expect(Object.keys(TEST_SIM.simProduction.distributeLedger).length).to.equal(3);
        TEST_SIM.simProduction.distribute(TEST_SIM.people);
        let randomPerson = Object.values(TEST_SIM.people)[0];
        expect(randomPerson.work.produce > 0).to.be.true;
        TEST_SIM.simProduction.reset();
        expect(TEST_SIM.simProduction.distributeLedger).to.be.empty;
    });

    it('test globalWorkIteration', () => {
        expect(TEST_SIM.simProduction.distributeLedger).to.be.empty;
        TEST_SIM.simProduction.globalWorkIteration(TEST_SIM.people);
    });
});
