import { TEST_TERRAIN } from './util/locationTest';
import { Simulation } from '../../src/sim/sim';
import { Square } from '../../src/map/square';
import { INITIAL_PERSON_COUNT } from '../../src/constant/simConstants';
import generateTerrain from '../../src/map/generateTerrain';
import matchingService from '../../src/sim/util/matchingService';
import { expect } from 'chai';
import { locationToString } from '../../src/sim/util/location';


export const TEST_SIM = (() => {
    let sim = new Simulation(TEST_TERRAIN);
    sim.initialize(3);
    return sim;
})();


export function getSimulationOnTerrain(): Simulation {
    let terrain: Square[][];
    let count = 0;
    while (count < 10) {
        terrain = generateTerrain(20);
        if ([].concat(...terrain).filter(s => !s.isWater()).length > 100) {
            break;
        }
        count++;
    }
    let sim = new Simulation(terrain);
    sim.initialize(20);
    return sim;
}


describe('sim:simulation', () => {

    it('test initialization', () => {
        let sim = new Simulation(TEST_TERRAIN);
        sim.initialize(3);
        expect(sim.households.size).to.equal(3);
        expect(sim.people.size).to.equal(3);
    });

    it('test basic consumption', () => {
        let sim = new Simulation(TEST_TERRAIN);
        sim.initialize(5);
        sim.simProduction.globalWorkIteration(sim.people);
        expect(sim.households.values().next().value.storage.getResource("food")).to.be.gt(0);
        sim.allDo(hh => hh.getProjectedConsumption());
        sim.allDo(hh => hh.consume());
        expect(sim.households.values().next().value.adults[0].consumption["food"]).to.be.gt(0);
    });

    it('test populateSquareInfo', () => {
        let sim = new Simulation(TEST_TERRAIN);
        sim.initialize(5);
        let household = sim.households.values().next().value;
        let square = sim.terrain[household.location.y][household.location.x];
        expect(square.simInfo.households).to.contain(household);
        expect(square.simInfo.people.length).to.be.gt(0);
    });

    it('test large consumption', () => {
        let sim = getSimulationOnTerrain();
        sim.simProduction.globalWorkIteration(sim.people);
        sim.allDo(hh => hh.getProjectedConsumption());
        sim.allDo(hh => hh.consume());
        sim.households.forEach(hh => {
            let hasFood = hh.storage.getResource("food") > 0;
            let person = hh.adults[0];
            if (hasFood) {
                expect(person.isHungry()).to.be.false;
            } else if (person.work.produce == person.getBaseFoodConsumption()) {
                expect(person.isHungry()).to.be.false;
            } else {
                expect(person.isHungry()).to.be.true;
            }
        });
    });

    it('test runTurn', () => {
        let sim = getSimulationOnTerrain();
        let turn = 0;
        while (turn < 30) {
            sim.runTurn();
            turn++;
            // Ensure sanity
            sim.households.forEach(hh => {
                hh.dependents.forEach(d => {
                    expect(d.household.id).to.equal(hh.id);
                    expect(sim.people.has(d.id)).to.be.true;
                });
                hh.adults.forEach(a => {
                    expect(a.household.id).to.equal(hh.id);
                    expect(sim.people.has(a.id)).to.be.true;
                });
            })
            sim.people.forEach(p => {
                expect(p.household).to.not.be.undefined;
            });
        }
    });

    it('test matchingService', () => {
        let largeSim = getSimulationOnTerrain();
        largeSim.simProduction.globalWorkIteration(largeSim.people);
        largeSim.allDo(hh => hh.getProjectedConsumption());
        largeSim.allDo(hh => hh.consume());
        let singleCount = largeSim.households.size;
        let matched = matchingService(largeSim);
        expect(largeSim.households.size).to.equal(singleCount - matched);
        largeSim.households.forEach((hh, hhid) => {
            hh.adults.forEach(p => {
                expect(p.household).to.equal(hh);
            });
        });
    });
});

