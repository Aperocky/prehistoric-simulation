import inherit from '../../../../src/sim/people/actions/inherit';
import { Household } from '../../../../src/sim/people/household';
import { getSimulationOnTerrain } from '../../simTest';
import { expect } from 'chai';

describe('people:move', () => {

    it('test inheritance', () => {
        let sim = getSimulationOnTerrain();
        let vader = Array.from(sim.households.values())[0];
        vader.getProjectedConsumption();
        vader.consume();
        vader.storage.addResource("food", 10);
        let luke = Array.from(sim.households.values())[1];
        let lukeid = luke.adults[0].id;
        vader.adults[0].heritage.children.push(lukeid);
        vader.adults[0].health = -100;
        vader.runHealth(sim);
        expect(luke.storage.getResource("food")).to.equal(10);
    });

    it('test inheriting house', () => {
        let sim = getSimulationOnTerrain();
        let vader = Array.from(sim.households.values())[0];
        vader.getProjectedConsumption();
        vader.consume();
        vader.storage.addResource("housing", 10);
        let luke = Array.from(sim.households.values())[1];
        let lukeid = luke.adults[0].id;
        luke.location = JSON.parse(JSON.stringify(vader.location));
        let leia = Array.from(sim.households.values())[2];
        let leiaid = leia.adults[0].id;
        if (leia.location.x == vader.location.x
            && leia.location.y == leia.location.y) {
            leia.location.x += leia.location.x > 10 ? -1 : 1;
        }
        vader.adults[0].heritage.children.push(lukeid);
        vader.adults[0].heritage.children.push(leiaid);
        vader.adults[0].health = -100;
        vader.runHealth(sim);
        expect(luke.storage.getResource("housing")).to.equal(10);
        expect(leia.storage.getResource("housing")).to.equal(0);
    });
});
