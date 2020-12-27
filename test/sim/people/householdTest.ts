import { Person } from '../../../src/sim/people/person';
import { Heritage, childHeritage } from '../../../src/sim/people/properties/heritage';
import { Household } from '../../../src/sim/people/household';
import { Location } from '../../../src/sim/util/location';
import { ORIGIN_NAME } from '../../../src/constant/simConstants';
import { WILL_TURNER, LIZ_SWANN } from './personTest';
import { TEST_SIM, getSimulationOnTerrain } from '../simTest';
import { expect } from 'chai';
import matchingService from '../../../src/sim/util/matchingService';

describe('people:household', () => {
    it('test seeding household', () => {
        let heritage: Heritage = {
            surname: "Sparrow",
            name: "Jack",
            father: ORIGIN_NAME,
            mother: ORIGIN_NAME,
            gender: 1,
            children: []
        }
        let jack: Person = new Person(heritage);
        jack.age = 20
        let location: Location = { x: 6, y: 9 };
        let household = new Household([], jack, location);
        expect(household.storage.getResource("wood")).to.equal(0);
        expect(household.isSingle).to.be.true;
        expect(household.adults.length).to.equal(1);
        expect(household.dependents).to.be.empty;
        expect(jack.household).to.equal(household);
    });

    it('test merging household', () => {
        let lizhouse = new Household([], LIZ_SWANN, {x: 6, y: 9});
        let willhouse = new Household([], WILL_TURNER, {x: 9, y: 6});
        let pirates = new Household([willhouse, lizhouse]);
        expect(pirates.location).to.deep.equal({x: 9, y: 6});
        expect(pirates.isSingle).to.be.false;
        expect(WILL_TURNER.household).to.equal(pirates);
        expect(LIZ_SWANN.household).to.equal(pirates);
        // cleanup
        LIZ_SWANN.setHousehold(undefined);
        WILL_TURNER.setHousehold(undefined);
    });

    it('test single household consumption', () => {
        let house = new Household([], WILL_TURNER, {x: 9, y: 6});
        expect(house.projectedConsumption).to.be.empty;
        house.getProjectedConsumption();
        expect(house.projectedConsumption["food"]).to.equal(1);
        house.storage.addResource("food", 1.5);
        house.consume();
        expect(house.percentSatisfied["food"]).to.equal(1);
        expect(house.adults[0].consumption["food"]).to.equal(1);
        house.consume();
        expect(house.percentSatisfied["food"]).to.equal(0.5);
        expect(house.adults[0].consumption["food"]).to.equal(0.5);
        // cleanup
        WILL_TURNER.setHousehold(undefined);
        WILL_TURNER.consumption = {};
    });

    it('test changeWork', () => {
        let house = new Household([], WILL_TURNER, {x: 1, y: 1});
        house.getProjectedConsumption();
        house.storage.addResource("food", 0.5);
        house.consume();
        expect(WILL_TURNER.work.work).to.equal("HUNT");
        expect(TEST_SIM.terrain[1][1].isCoast).to.be.true;
        for (let i = 0; i < 100; i++) {
            house.changeWork(TEST_SIM);
        }
        expect(WILL_TURNER.work.work).to.equal("FISH");
        // cleanup
        WILL_TURNER.setHousehold(undefined);
        WILL_TURNER.consumption = {};
        WILL_TURNER.work.work = "HUNT";
    });

    it('test multi household consumption', () => {
        let lizhouse = new Household([], LIZ_SWANN, {x: 6, y: 9});
        let willhouse = new Household([], WILL_TURNER, {x: 9, y: 6});
        let pirates = new Household([willhouse, lizhouse]);
        let baby = new Person(childHeritage(WILL_TURNER, LIZ_SWANN));
        pirates.dependents.push(baby);
        baby.household = pirates;
        pirates.storage.addResource("food", 4);
        pirates.getProjectedConsumption();
        expect(pirates.projectedConsumption["food"]).to.equal(2.5);
        pirates.consume();
        expect(pirates.percentSatisfied["food"]).to.equal(1);
        expect(LIZ_SWANN.consumption["food"]).to.equal(1);
        expect(baby.consumption["food"]).to.equal(0.5);
        pirates.consume();
        expect(pirates.percentSatisfied["food"]).to.equal(0.6);
        expect(WILL_TURNER.consumption["food"]).to.equal(0.6);
        expect(baby.consumption["food"]).to.equal(0.3);
        // cleanup
        LIZ_SWANN.setHousehold(undefined);
        LIZ_SWANN.consumption = {}
        WILL_TURNER.setHousehold(undefined);
        WILL_TURNER.consumption = {}
    });

    it('test birth', () => {
        let lizhouse = new Household([], LIZ_SWANN, {x: 6, y: 9});
        let willhouse = new Household([], WILL_TURNER, {x: 9, y: 6});
        let pirates = new Household([willhouse, lizhouse]);
        pirates.percentSatisfied["food"] = 1;
        LIZ_SWANN.health = 100;
        expect(pirates.birthChance(LIZ_SWANN)).to.be.gt(0);
        while (true) {
            let baby = pirates.birth();
            if (baby != null) {
               expect(baby.heritage.surname).to.equal("Turner");
               expect(baby.heritage.mother).to.equal(LIZ_SWANN.id);
               expect(baby.heritage.father).to.equal(WILL_TURNER.id);
               expect(baby.age).to.equal(0);
               expect(baby.health).to.equal(10);
               expect(pirates.dependents.length).to.equal(1);
               expect(LIZ_SWANN.heritage.children[0]).to.equal(baby.id);
               expect(WILL_TURNER.heritage.children[0]).to.equal(baby.id);
               break;
            }
        }
        pirates.percentSatisfied["food"] = 0.6;
        expect(pirates.birthChance(LIZ_SWANN)).to.be.lt(0);
        // cleanup
        LIZ_SWANN.heritage.children = [];
        WILL_TURNER.heritage.children = [];
        LIZ_SWANN.health = 10;
        LIZ_SWANN.setHousehold(undefined);
        WILL_TURNER.setHousehold(undefined);
    });

    it('test mortality of single household', () => {
        let sim = getSimulationOnTerrain();
        sim.simProduction.globalWorkIteration(sim.people);
        sim.allDo(hh => hh.getProjectedConsumption());
        sim.allDo(hh => hh.consume());
        let target = sim.households.values().next().value;
        expect(sim.households.has(target.id)).to.be.true;
        expect(sim.people.has(target.adults[0].id)).to.be.true;
        target.adults[0].health = -20;
        target.runHealth(sim);
        expect(sim.households.has(target.id)).to.be.false;
        expect(sim.people.has(target.adults[0].id)).to.be.false;
    });

    it('test mortality in multi household', () => {
        let sim = getSimulationOnTerrain();
        sim.simProduction.globalWorkIteration(sim.people);
        matchingService(sim);
        sim.allDo(hh => hh.getProjectedConsumption());
        sim.allDo(hh => hh.consume());
        let targets = Array.from(sim.households.values()).filter(hh => !hh.isSingle);
        if (!(targets.length)) {
            console.log("not able to get targets, change matching service?");
        }
        // Test targets go back to single.
        let sorry = targets[0].adults[0];
        sorry.health = -20;
        expect(targets[0].adults).to.contain(sorry);
        expect(sim.people.has(sorry.id)).to.be.true;
        targets[0].runHealth(sim);
        expect(targets[0].isSingle).to.be.true;
        expect(targets[0].adults).to.not.contain(sorry);
        expect(sim.people.has(sorry.id)).to.be.false;
    });

    it('test going independent', () => {
        let sim = getSimulationOnTerrain();
        sim.simProduction.globalWorkIteration(sim.people);
        matchingService(sim);
        sim.allDo(hh => hh.getProjectedConsumption());
        sim.allDo(hh => hh.consume());
        let targets = Array.from(sim.households.values()).filter(hh => !hh.isSingle);
        if (!(targets.length)) {
            console.log("not able to get targets, change matching service?");
        }
        let target = targets[0];
        let householdSize = sim.households.size;
        sim.people.set(WILL_TURNER.id, WILL_TURNER);
        target.dependents.push(WILL_TURNER);
        WILL_TURNER.setHousehold(target);
        target.adulthood(sim);
        expect(WILL_TURNER.household).to.not.equal(target)
        expect(sim.households.size - 1).to.equal(householdSize);
        expect(target.dependents).to.be.empty;
    });

    it('ensure sanity in mortality', () => {
        let sim = getSimulationOnTerrain();
        sim.simProduction.globalWorkIteration(sim.people);
        sim.allDo(hh => hh.getProjectedConsumption());
        sim.allDo(hh => hh.consume());
        let preSize = sim.households.size;
        let preHealth = 0;
        sim.people.forEach(p => { preHealth += p.health });
        sim.households.forEach(hh => {
            hh.runHealth(sim);
        });
        let postSize = sim.households.size;
        let postHealth = 0;
        sim.people.forEach(p => { postHealth += p.health });
        expect(postSize).to.be.gt(0.5*preSize);
        expect(postHealth).to.be.gt(preHealth*0.5);
    });
});
