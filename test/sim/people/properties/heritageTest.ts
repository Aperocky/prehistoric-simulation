import { Heritage, initialHeritage, childHeritage } from '../../../../src/sim/people/properties/heritage';
import { GIVEN_NAMES_FEMALE, GIVEN_NAMES_MALE, ORIGIN_NAME } from '../../../../src/constant/simConstants';
import { Person } from '../../../../src/sim/people/person';
import { expect } from 'chai';


describe('heritage', () => {
    it('test initializing heritage', () => {
        let heritage = initialHeritage();
        expect(heritage.father).to.equal(ORIGIN_NAME);
        expect(heritage.mother).to.equal(ORIGIN_NAME);
        if (heritage.gender) {
            expect(GIVEN_NAMES_MALE).to.contain(heritage.name);
        } else {
            expect(GIVEN_NAMES_FEMALE).to.contain(heritage.name);
        }
    });
    it('test childHeritage', () => {
        let will = new Person({
            surname: "Turner",
            name: "William",
            father: ORIGIN_NAME,
            mother: ORIGIN_NAME,
            gender: 1,
            children: []
        })
        let liz = new Person({
            surname: "Swann",
            name: "Elizabeth",
            father: ORIGIN_NAME,
            mother: ORIGIN_NAME,
            gender: 0,
            children: []
        })
        let little = childHeritage(will, liz, false);
        expect(little.surname).to.equal("Turner");
        expect(little.father).to.equal(will.id);
        expect(little.mother).to.equal(liz.id);
        expect(little.children).to.be.empty;
    });
});
