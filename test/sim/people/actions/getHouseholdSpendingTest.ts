import { Household } from '../../../../src/sim/people/household';
import getHouseholdSpending from '../../../../src/sim/people/actions/getHouseholdSpending';
import shop from '../../../../src/sim/people/actions/shop';
import { WILL_TURNER, LIZ_SWANN } from '../personTest';
import { expect } from 'chai';


describe('people:household', () => {
    it('test single household none demand', () => {
        let house = new Household([], WILL_TURNER, {x: 9, y: 6});
        house.storage.addResource("food", 10);
        house.getProjectedConsumption();
        expect("service" in house.projectedConsumption).to.be.false;
        expect("housing" in house.projectedConsumption).to.be.false;
        // cleanup
        WILL_TURNER.setHousehold(undefined);
    });

    it('test house demand', () => {
        let lizhouse = new Household([], LIZ_SWANN, {x: 6, y: 9});
        let willhouse = new Household([], WILL_TURNER, {x: 9, y: 6});
        let pirates = new Household([willhouse, lizhouse]);
        pirates.storage.addResource("food", 20);
        pirates.getProjectedConsumption();
        expect(pirates.projectedConsumption["housing"]).to.equal(3);
        expect("service" in pirates.projectedConsumption).to.be.false;
        // cleanup
        LIZ_SWANN.setHousehold(undefined);
        WILL_TURNER.setHousehold(undefined);
    });

    it('test integration with shop', () => {
        let lizhouse = new Household([], LIZ_SWANN, {x: 6, y: 9});
        let willhouse = new Household([], WILL_TURNER, {x: 9, y: 6});
        let pirates = new Household([willhouse, lizhouse]);
        pirates.storage.gold = 10;
        pirates.storage.addResource("food", 20);
        pirates.getProjectedConsumption();
        let orders = shop(pirates);
        expect(orders.some(o => o.resourceName == "housing" && o.orderType));
        // cleanup
        LIZ_SWANN.setHousehold(undefined);
        WILL_TURNER.setHousehold(undefined);
    });
});
