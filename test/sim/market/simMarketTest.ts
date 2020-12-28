import { SimMarket } from '../../../src/sim/market/simMarket';
import { getSimulationOnTerrain } from '../simTest';
import { expect } from 'chai';


describe('market:integration', () => {
    it('test integration', () => {
        for (let i = 0; i < 10; i++) {
            let sim = getSimulationOnTerrain();
            sim.simProduction.globalWorkIteration(sim.people);
            sim.allDo(hh => hh.getProjectedConsumption());
            sim.simMarket.run(Array.from(sim.households.values()));
            // Make sure orders are delivered.
            sim.households.forEach(hh => {
                if (hh.orders.length) {
                    // if no order went through, money should not change.
                    if (hh.orders.every(o => !o.delivered)) {
                        expect(hh.storage.gold).to.equal(1);
                    } else {
                        let delivered = hh.orders.filter(o => o.delivered)[0]
                        if (delivered.orderType) {
                            expect(hh.storage.gold).to.be.lt(1);
                            expect(hh.storage.getResource("food")).to.be.gt(hh.adults[0].work.produce);
                        } else {
                            expect(hh.storage.gold).to.be.gt(1);
                            expect(hh.storage.getResource("food")).to.be.lt(hh.adults[0].work.produce);
                        }
                    }
                }
            });
        }
    });

    it('test multiTurns', () => {
        let sim = getSimulationOnTerrain();
        let turn = 0;
        while (turn < 20) {
            sim.runTurn();
            turn++;
            // pump money
            sim.allDo(hh => hh.storage.addGold(1));
            let foodEngine = sim.simMarket.ledger.get("food")
            expect(foodEngine.sellOrderCount + foodEngine.buyOrderCount).to.be.gt(0);
        }
    });
});
