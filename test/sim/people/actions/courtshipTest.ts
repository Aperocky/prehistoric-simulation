import courtship from '../../../../src/sim/people/actions/courtship';
import { ResourceType } from '../../../../src/sim/people/properties/resourceTypes';
import { Person } from '../../../../src/sim/people/person';
import { LIZ_SWANN, WILL_TURNER, JACK_SPARROW } from '../personTest';
import { ORIGIN_NAME } from '../../../../src/constant/simConstants';
import { expect } from 'chai';

describe('people:courtship', () => {
    it('test successful courtship', () => {
        LIZ_SWANN.consumption = {"food": 0.5};
        LIZ_SWANN.heritage.father = "GovSwann";
        LIZ_SWANN.heritage.mother = "LadySwann";
        expect(LIZ_SWANN.isHungry()).to.be.true;
        expect(courtship(LIZ_SWANN, WILL_TURNER)).to.be.true;
        // Cleanup
        LIZ_SWANN.heritage.father = ORIGIN_NAME;
        LIZ_SWANN.heritage.mother = ORIGIN_NAME;
        LIZ_SWANN.consumption = {};
    });

    it('test bad courtship', () => {
        LIZ_SWANN.heritage.father = "GovSwann";
        LIZ_SWANN.heritage.mother = "LadySwann";
        expect(courtship(LIZ_SWANN, JACK_SPARROW)).to.be.false;
        // Cleanup
        LIZ_SWANN.heritage.father = ORIGIN_NAME;
        LIZ_SWANN.heritage.mother = ORIGIN_NAME;
    });

    it('test sibling', () => {
        expect(courtship(LIZ_SWANN, WILL_TURNER)).to.be.false;
    });
});
