import { Order } from '../../../src/sim/market/order';
import { MarketEngine } from '../../../src/sim/market/marketEngine';
import { expect } from 'chai';
import { v4 as uuid } from 'uuid';


function generateOrder(name: string, resourceType: string,
        quantity: number, amount: number, orderType: boolean): Order {
    return new Order(name, resourceType, quantity, amount, orderType);
}

const GATES_ORDER = generateOrder("gates", "food", 1, 1, true);
const BUFFET_ORDER = generateOrder("buffet", "food", 1, 2, true);
const BEZOS_ORDER = generateOrder("bezos", "food", 2, 1, true);

const SMALL_SUPPLY = generateOrder("mcdonalds", "food", 1, 1, false);
const MEDIUM_SUPPLY = generateOrder("mcdouble", "food", 2, 1.5, false);
const LARGE_SUPPLY = generateOrder("mcjumbo", "food", 3, 2, false);

function generateRandomOrder(orderType: boolean): Order {
    let quantity = Math.random() * 2 + 1;
    let amount = Math.random() * 2 + 1;
    return new Order(uuid(), "food", quantity, amount, orderType);
}

describe('market:engine', () => {
    it('test seeding', () => {
        let engine = new MarketEngine("food");
        engine.addOrder(GATES_ORDER);
        engine.addOrder(BUFFET_ORDER);
        engine.addOrder(BEZOS_ORDER);
        engine.addOrder(SMALL_SUPPLY);
        expect(engine.sellOrders.length).to.equal(1);
        expect(engine.buyOrders.length).to.equal(3);
    });

    it('test sorting', () => {
        let engine = new MarketEngine("food");
        engine.addOrder(GATES_ORDER);
        engine.addOrder(BUFFET_ORDER);
        engine.addOrder(BEZOS_ORDER);
        engine.addOrder(SMALL_SUPPLY);
        engine.addOrder(MEDIUM_SUPPLY);
        engine.addOrder(LARGE_SUPPLY);
        expect(engine.buyOrders.length).to.equal(3);
        engine.sortOrders();
        expect(engine.buyOrders.pop().source).to.equal("buffet");
        expect(engine.buyOrders.pop().source).to.equal("gates");
        expect(engine.buyOrders.pop().source).to.equal("bezos");
        expect(engine.sellOrders.pop().source).to.equal("mcjumbo");
        expect(engine.sellOrders.pop().source).to.equal("mcdouble");
        expect(engine.sellOrders.pop().source).to.equal("mcdonalds");
    });

    it('test 1:1 match happy case', () => {
        let engine = new MarketEngine("food");
        engine.addOrder(GATES_ORDER);
        engine.addOrder(SMALL_SUPPLY);
        engine.sortOrders();
        let price = engine.match();
        expect(engine.sellOrders).to.be.empty;
        expect(engine.buyOrders).to.be.empty;
        expect(engine.completedOrder.length).to.equal(2);
        expect(price).to.equal(1);
    });

    it('test 1:1 match price diff', () => {
        let engine = new MarketEngine("food");
        engine.addOrder(BUFFET_ORDER);
        engine.addOrder(SMALL_SUPPLY);
        engine.sortOrders();
        let price = engine.match();
        expect(engine.sellOrders).to.be.empty;
        expect(engine.buyOrders).to.be.empty;
        expect(engine.completedOrder.length).to.equal(2);
        expect(price).to.equal(1);
    });

    it('test multiple order happy case', () => {
        let engine = new MarketEngine("food");
        engine.addOrder(BUFFET_ORDER);
        engine.addOrder(GATES_ORDER);
        engine.addOrder(MEDIUM_SUPPLY);
        engine.sortOrders();
        let price = engine.match();
        expect(engine.sellOrders).to.be.empty;
        expect(engine.buyOrders).to.be.empty;
        expect(engine.completedOrder.length).to.equal(3);
        expect(price).to.equal(0.75);
    });

    it('test price unmatch', () => {
        let engine = new MarketEngine("food");
        engine.addOrder(BEZOS_ORDER);
        engine.addOrder(MEDIUM_SUPPLY);
        engine.sortOrders();
        let price = engine.match();
        expect(engine.sellOrders.length).to.equal(1);
        expect(engine.buyOrders.length).to.equal(1);
        expect(engine.completedOrder).to.be.empty;
        expect(price).to.equal(0);
    })

    it('test multi orders', () => {
        let engine = new MarketEngine("food");
        engine.addOrder(GATES_ORDER);
        engine.addOrder(BUFFET_ORDER);
        engine.addOrder(BEZOS_ORDER);
        engine.addOrder(SMALL_SUPPLY);
        engine.addOrder(MEDIUM_SUPPLY);
        engine.addOrder(LARGE_SUPPLY);
        engine.sortOrders();
        let price = engine.match();
        expect(engine.sellOrders.length).to.equal(3);
        expect(engine.buyOrders.length).to.equal(1);
        expect(engine.completedOrder.length).to.equal(2);
        expect(price).to.be.closeTo(0.66, 0.01);
    })

    it('large scale test', () => {
        let engine = new MarketEngine("food");
        for (let i = 0; i < 50; i++) {
            engine.addOrder(generateRandomOrder(true));
            engine.addOrder(generateRandomOrder(false));
        }
        engine.sortOrders();
        let price = engine.match();
        engine.completedOrder.forEach(order => {
            if (order.orderType) {
                expect(order.unitPrice >= price).to.be.true;
            } else {
                expect(order.unitPrice <= price).to.be.true;
            }
        });
    });

    it('large scale encapsulated test', () => {
        for(let i = 0; i < 10; i++) {
            let engine = new MarketEngine("food");
            for (let i = 0; i < 50; i++) {
                engine.addOrder(generateRandomOrder(true));
                engine.addOrder(generateRandomOrder(false));
            }
            engine.run();
            engine.completedOrder.forEach(order => {
                if (order.orderType) {
                    expect(order.unitPrice >= engine.settlePrice).to.be.true;
                } else {
                    expect(order.unitPrice <= engine.settlePrice).to.be.true;
                }
                expect(order.delivered).to.be.true;
                expect(order.settlePrice).to.equal(engine.settlePrice);
            });
        }
    });
});
