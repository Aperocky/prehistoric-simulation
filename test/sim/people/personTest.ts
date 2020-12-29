import { Person } from '../../../src/sim/people/person';
import { Heritage, initialHeritage } from '../../../src/sim/people/properties/heritage';
import { ResourceType } from '../../../src/sim/people/properties/resourceTypes';
import { ORIGIN_NAME } from '../../../src/constant/simConstants';
import { WORK_TYPES } from '../../../src/sim/people/work/workTypes';
import { expect } from 'chai';

export const JACK_SPARROW = (() => {
    let jack = new Person({
        surname: "Sparrow",
        name: "Jack",
        father: ORIGIN_NAME,
        mother: ORIGIN_NAME,
        gender: 1,
        children: []
    });
    jack.age = 50;
    return jack;
})();

export const WILL_TURNER = (() => {
    let will = new Person({
        surname: "Turner",
        name: "Will",
        father: ORIGIN_NAME,
        mother: ORIGIN_NAME,
        gender: 1,
        children: []
    });
    will.age = 20;
    return will;
})();

export const LIZ_SWANN = (() => {
    let liz = new Person({
        surname: "Swann",
        name: "Elizabeth",
        father: ORIGIN_NAME,
        mother: ORIGIN_NAME,
        gender: 0,
        children: []
    });
    liz.age = 18;
    return liz;
})();

export function getRandomOriginPerson() {
    return new Person(initialHeritage());
}

describe('people:person', () => {
    it('test seeding person', () => {
        let heritage: Heritage = {
            surname: "Sparrow",
            name: "Jack",
            father: ORIGIN_NAME,
            mother: ORIGIN_NAME,
            gender: 1,
            children: []
        }
        let jack: Person = new Person(heritage);
        expect(jack.heritage.father).to.equal(ORIGIN_NAME);
        expect(jack.age).to.equal(0);
    });

    it('test desired consumption', () => {
        expect(LIZ_SWANN.getConsumption()[ResourceType.Food]).to.equal(1);
    });

    it('test work consumption', () => {
        WILL_TURNER.work.work = "FISH";
        expect(WILL_TURNER.getConsumption()[ResourceType.Wood])
                .to.equal(WORK_TYPES.FISH.consume[ResourceType.Wood]);
        expect(WILL_TURNER.getConsumption()[ResourceType.Food]).to.equal(1);
        // Cleanup
        WILL_TURNER.work.work = "HUNT";
    });

    it('test isHungry', () => {
        expect(WILL_TURNER.isHungry()).to.be.false;
        WILL_TURNER.consumption = {"food": 0.3};
        expect(WILL_TURNER.isHungry()).to.be.true;
        WILL_TURNER.consumption = {"food": 1.3};
        expect(WILL_TURNER.isHungry()).to.be.false;
        // cleanup
        WILL_TURNER.consumption = {};
    });

    it('test runHealth', () => {
        expect(WILL_TURNER.age).to.equal(20);
        expect(WILL_TURNER.health).to.equal(10);
        WILL_TURNER.consumption = {"food": 1};
        WILL_TURNER.runHealth(0);
        expect(WILL_TURNER.age).to.equal(21);
        expect(WILL_TURNER.health).to.equal(14);
        // cleanup
        WILL_TURNER.age = 20;
        WILL_TURNER.health = 10;
        WILL_TURNER.consumption = {};
    });

    it('test runHealth sick', () => {
        expect(JACK_SPARROW.age).to.equal(50);
        expect(JACK_SPARROW.health).to.equal(10);
        JACK_SPARROW.consumption = {"food": 1};
        JACK_SPARROW.runHealth(1);
        expect(JACK_SPARROW.age).to.equal(51);
        expect(JACK_SPARROW.health).to.equal(-9);
        // cleanup
        JACK_SPARROW.age = 50;
        JACK_SPARROW.health = 10;
        JACK_SPARROW.consumption = {};
    });
});
