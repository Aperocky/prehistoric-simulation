import { Person } from '../../../src/sim/people/person';
import { Heritage } from '../../../src/sim/people/properties/heritage';
import { Household } from '../../../src/sim/people/household';
import { Location } from '../../../src/sim/util/location';
import { ORIGIN_NAME } from '../../../src/constant/simConstants';
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
        let household: Household  = new Household([], jack, location);
        expect(household.holderId).to.be.equal(jack.id);
        expect(household.storage.getResource("wood")).to.equal(0);
        expect(household.isSingle).to.be.true;
        expect(household.adults.length).to.equal(1);
        expect(household.dependents).to.be.empty;
    });
});
