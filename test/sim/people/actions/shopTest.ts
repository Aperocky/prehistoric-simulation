import shop from '../../../../src/sim/people/actions/shop';
import { Household } from '../../../../src/sim/people/household';
import { Order } from 'market-transactions-engine';
import { WILL_TURNER, LIZ_SWANN, getRandomOriginPerson } from '../personTest';
import { expect } from 'chai';


describe('people:shop', () => {
    it('test hunger buying', () => {
        let hh = new Household([], WILL_TURNER, {x: 9, y: 6});
        expect(WILL_TURNER.health).to.equal(10); // riskAcceptance: 11, safetyMargin: 3
        hh.getProjectedConsumption();
        hh.storage.gold = 1;
        let orders = shop(hh);
        expect(orders.length).to.equal(1);
        let order = orders[0];
        expect(order.resourceName).to.equal("food");
        expect(order.quantity).to.equal(1);
        expect(order.unitPrice).to.equal(1);
        expect(order.orderType).to.be.true;
        expect(order.delivered).to.be.false;
        expect(hh.storage.gold).to.equal(0);
        // cleanup
        WILL_TURNER.setHousehold(undefined);
    });

    it('test risky hunger buying', () => {
        let hh = new Household([], WILL_TURNER, {x: 9, y: 6});
        WILL_TURNER.health = 49; // riskAcceptance: 50, safetyMargin: 2
        hh.getProjectedConsumption();
        hh.storage.gold = 1;
        let orders = shop(hh);
        expect(orders.length).to.equal(2);
        let firstOrder = orders[0];
        expect(firstOrder.resourceName).to.equal("food");
        expect(firstOrder.quantity).to.equal(1);
        expect(firstOrder.unitPrice).to.equal(0.5);
        expect(firstOrder.orderType).to.be.true;
        let secondOrder = orders[1];
        expect(secondOrder.resourceName).to.equal("food");
        expect(secondOrder.quantity).to.equal(1);
        expect(secondOrder.unitPrice).to.equal(0.1);
        expect(secondOrder.orderType).to.be.true;
        expect(hh.storage.gold).to.equal(0.4);
        // Cleanup
        WILL_TURNER.health = 10;
        WILL_TURNER.setHousehold(undefined);
    });

    it('test multi-person family buying', () => {
        let lizhouse = new Household([], LIZ_SWANN, {x: 6, y: 9});
        let willhouse = new Household([], WILL_TURNER, {x: 9, y: 6});
        let pirates = new Household([willhouse, lizhouse]);
        WILL_TURNER.health = 68;
        LIZ_SWANN.health = 88;
        let baby = getRandomOriginPerson();
        baby.age = 0;
        pirates.dependents.push(baby); // riskAcceptance: 40, safetyMargin: 2.5
        pirates.getProjectedConsumption();
        pirates.storage.gold = 8;
        pirates.storage.addResource("food", 2);
        let orders = shop(pirates);
        expect(orders.length).to.equal(4);
        let firstOrder = orders[0];
        expect(firstOrder.resourceName).to.equal("food");
        expect(firstOrder.quantity).to.equal(0.5);
        expect(firstOrder.unitPrice).to.equal(10);
        expect(firstOrder.orderType).to.be.true;
        let secondOrder = orders[1];
        expect(secondOrder.resourceName).to.equal("food");
        expect(secondOrder.quantity).to.equal(3.75);
        expect(secondOrder.unitPrice).to.equal(0.3);
        expect(secondOrder.orderType).to.be.true;
        let thirdOrder = orders[2];
        expect(thirdOrder.resourceName).to.equal("medicine");
        // Cleanup
        LIZ_SWANN.health = 10;
        WILL_TURNER.health = 10;
        LIZ_SWANN.setHousehold(undefined);
        WILL_TURNER.setHousehold(undefined);
    });

    it('test buying with inadequate inventory', () => {
        let hh = new Household([], WILL_TURNER, {x: 9, y: 6});
        WILL_TURNER.health = 49; // riskAcceptance: 50, safetyMargin: 2
        hh.getProjectedConsumption();
        hh.storage.gold = 1;
        hh.storage.addResource("food", 0.5);
        let orders = shop(hh);
        expect(orders.length).to.equal(2);
        let firstOrder = orders[0];
        expect(firstOrder.resourceName).to.equal("food");
        expect(firstOrder.quantity).to.equal(0.5);
        expect(firstOrder.unitPrice).to.equal(1);
        expect(firstOrder.orderType).to.be.true;
        let secondOrder = orders[1];
        expect(secondOrder.resourceName).to.equal("food");
        expect(secondOrder.quantity).to.equal(1);
        expect(secondOrder.unitPrice).to.equal(0.1);
        expect(secondOrder.orderType).to.be.true;
        expect(hh.storage.gold).to.equal(0.4);
        // Cleanup
        WILL_TURNER.health = 10;
        WILL_TURNER.household = undefined;
        WILL_TURNER.setHousehold(undefined);
    });

    it('test buying with adequate inventory', () => {
        let hh = new Household([], WILL_TURNER, {x: 9, y: 6});
        WILL_TURNER.health = 49; // riskAcceptance: 50, safetyMargin: 2
        hh.getProjectedConsumption();
        hh.storage.gold = 1;
        hh.storage.addResource("food", 1.5);
        let orders = shop(hh);
        expect(orders.length).to.equal(1);
        let order = orders[0];
        expect(order.resourceName).to.equal("food");
        expect(order.quantity).to.equal(0.5);
        expect(order.unitPrice).to.equal(0.2);
        expect(order.orderType).to.be.true;
        expect(hh.storage.gold).to.equal(0.9);
        // Cleanup
        WILL_TURNER.health = 10;
        WILL_TURNER.setHousehold(undefined);
    });

    it('test selling', () => {
        let hh = new Household([], WILL_TURNER, {x: 9, y: 6});
        WILL_TURNER.health = 49; // riskAcceptance: 50, safetyMargin: 2
        hh.getProjectedConsumption();
        hh.storage.gold = 1;
        hh.storage.addResource("food", 5);
        let orders = shop(hh);
        expect(orders.length).to.equal(1);
        let order = orders[0];
        expect(order.resourceName).to.equal("food");
        expect(order.quantity).to.equal(3);
        expect(order.unitPrice).to.equal(0.125);
        expect(order.orderType).to.be.false;
        expect(hh.storage.getResource("food")).to.equal(2);
        // Cleanup
        WILL_TURNER.health = 10;
        WILL_TURNER.setHousehold(undefined);
    });

    it('test selling unneeded resource', () => {
        let hh = new Household([], WILL_TURNER, {x: 9, y: 6});
        WILL_TURNER.health = 49; // riskAcceptance: 50, safetyMargin: 2
        hh.getProjectedConsumption();
        hh.storage.gold = 1;
        hh.storage.addResource("food", 2);
        hh.storage.addResource("wood", 5);
        let orders = shop(hh);
        expect(orders.length).to.equal(1);
        let order = orders[0];
        expect(order.resourceName).to.equal("wood");
        expect(order.quantity).to.equal(5);
        expect(order.orderType).to.be.false;
        expect(hh.storage.getResource("wood")).to.equal(0);
        // Cleanup
        WILL_TURNER.health = 10;
        WILL_TURNER.setHousehold(undefined);
    });

    it('test not selling house', () => {
        let hh = new Household([], WILL_TURNER, {x: 9, y: 6});
        WILL_TURNER.health = 49; // riskAcceptance: 50, safetyMargin: 2
        hh.getProjectedConsumption();
        hh.storage.gold = 1;
        hh.storage.addResource("food", 2);
        hh.storage.addResource("wood", 5);
        hh.storage.addResource("housing", 10);
        let orders = shop(hh);
        expect(orders.every(o => o.resourceName != "housing")).to.be.true;
        // Cleanup
        WILL_TURNER.health = 10;
        WILL_TURNER.setHousehold(undefined);
    });

    it('test sell house when too hungry', () => {
        let hh = new Household([], WILL_TURNER, {x: 9, y: 6});
        WILL_TURNER.health = 49; // riskAcceptance: 50, safetyMargin: 2
        hh.percentSatisfied["food"] = 0.3;
        hh.getProjectedConsumption();
        hh.storage.gold = 1;
        hh.storage.addResource("housing", 10);
        let orders = shop(hh);
        let sellHouse = orders.filter(o => o.resourceName == "housing")[0];
        expect(sellHouse.quantity).to.equal(2);
        // Cleanup
        WILL_TURNER.health = 10;
        WILL_TURNER.setHousehold(undefined);
    });

    it('test buying and selling', () => {
        let hh = new Household([], WILL_TURNER, {x: 9, y: 6});
        WILL_TURNER.health = 49; // riskAcceptance: 50, safetyMargin: 2
        WILL_TURNER.work.work = "FISH";
        hh.getProjectedConsumption();
        hh.storage.gold = 1;
        hh.storage.addResource("food", 5);
        let orders = shop(hh);
        expect(orders.length).to.equal(2);
        let sellOrder = orders[0];
        expect(sellOrder.resourceName).to.equal("food");
        expect(sellOrder.quantity).to.equal(3);
        expect(sellOrder.orderType).to.be.false;
        let buyOrder = orders[1];
        expect(buyOrder.resourceName).to.equal("wood");
        expect(buyOrder.quantity).to.equal(4);
        expect(buyOrder.unitPrice).to.equal(0.125);
        expect(buyOrder.orderType).to.be.true;
        expect(hh.storage.gold).to.equal(0.5);
        expect(hh.storage.getResource("food")).to.equal(2);
        // Cleanup
        WILL_TURNER.health = 10;
        WILL_TURNER.work.work = "HUNT";
        WILL_TURNER.setHousehold(undefined);
    });

    it('test encapsulated shop function', () => {
        let hh = new Household([], WILL_TURNER, {x: 9, y: 6});
        WILL_TURNER.health = 49; // riskAcceptance: 50, safetyMargin: 2
        WILL_TURNER.work.work = "FISH";
        hh.getProjectedConsumption();
        hh.storage.gold = 1;
        hh.storage.addResource("food", 5);
        expect(hh.budget).to.equal(0); // budget is contained within shopping
        let orders = hh.shop();
        expect(hh.orders.length).to.equal(2);
        expect(orders.length).to.equal(2);
        let sellOrder = orders[0];
        expect(sellOrder.resourceName).to.equal("food");
        expect(sellOrder.quantity).to.equal(3);
        expect(sellOrder.orderType).to.be.false;
        let buyOrder = orders[1];
        expect(buyOrder.resourceName).to.equal("wood");
        expect(buyOrder.quantity).to.equal(4);
        expect(buyOrder.unitPrice).to.equal(0.125);
        expect(buyOrder.orderType).to.be.true;
        expect(hh.storage.gold).to.equal(1); // gold is returned and only processed after
        expect(hh.budget).to.equal(0); // budget is contained within shopping
        expect(hh.storage.getResource("food")).to.equal(2);
        hh.shop();
        expect(hh.orders.length).to.equal(1);
        // Cleanup
        WILL_TURNER.health = 10;
        WILL_TURNER.work.work = "HUNT";
        WILL_TURNER.setHousehold(undefined);
    });
});
