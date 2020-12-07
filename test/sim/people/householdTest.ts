import { Person } from '../../../src/sim/people/person';
import { Heritage } from '../../../src/sim/people/properties/heritage';
import { Household } from '../../../src/sim/people/household';
import { Location } from '../../../src/sim/util/location';
import { ORIGIN_NAME } from '../../../src/constant/simConstants';
import { WILL_TURNER, LIZ_SWANN } from './personTest';
import { expect } from 'chai';

describe('household', () => {
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
        expect(household.holderId).to.be.equal(jack.id);
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
        expect(pirates.holderId).to.equal(WILL_TURNER.id);
        expect(pirates.isSingle).to.be.false;
        expect(WILL_TURNER.household).to.equal(pirates);
        expect(LIZ_SWANN.household).to.equal(pirates);
        // cleanup
        LIZ_SWANN.setHousehold(undefined);
        WILL_TURNER.setHousehold(undefined);
    });
});
