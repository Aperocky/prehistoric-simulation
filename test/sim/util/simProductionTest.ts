import { SquareProduction } from '../../../src/sim/util/squareProduction';
import { SimProduction } from '../../../src/sim/util/simProduction';
import { Storage } from '../../../src/sim/people/properties/storage';
import { Square } from '../../../src/map/square';
import { TEST_SIM } from '../simTest';
import { expect } from 'chai';


describe('sim:simProduction', () => {
    it('test simProduction', () => {
        TEST_SIM.people.forEach(p => {
            p.work.doWork(TEST_SIM.simProduction);
        });
        TEST_SIM.simProduction.calculate();
        expect(Object.keys(TEST_SIM.simProduction.distributeLedger).length).to.equal(3);
        TEST_SIM.simProduction.distribute(TEST_SIM.people);
        let randomPerson = TEST_SIM.people.values().next().value;
        expect(randomPerson.work.produce > 0).to.be.true;
        TEST_SIM.simProduction.reset();
        expect(TEST_SIM.simProduction.distributeLedger).to.be.empty;
        // cleanup
        TEST_SIM.households.forEach(hh => {
            hh.storage = new Storage();
        })
        TEST_SIM.people.forEach(p => {
            p.work.produce = 0;
        });
    });

    it('test globalWorkIteration', () => {
        expect(TEST_SIM.simProduction.distributeLedger).to.be.empty;
        TEST_SIM.simProduction.globalWorkIteration(TEST_SIM.people);
        TEST_SIM.households.forEach(hh => {
            expect(hh.storage.getResource("food")).to.be.gt(0);
            // cleanup
            hh.storage = new Storage();
        });
        TEST_SIM.people.forEach(p => {
            p.work.produce = 0;
        });
    });
});
