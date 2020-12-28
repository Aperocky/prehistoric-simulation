import { Order } from './order';
import { MarketEngine } from './marketEngine';
import { Household } from '../people/household';

export type MarketReport = {
    sellOrders: number;
    buyOrders: number;
    sellOrderDelivered: number;
    buyOrderDelivered: number;
    sellVolume: number;
    buyVolume: number;
    settlePrice: number;
}

export class SimMarket {

    ledger: Map<string, MarketEngine>;
    report: Map<string, MarketReport>;

    getOrders(households: Household[]): void {
        this.ledger = new Map();
        households.forEach(hh => {
            let orders = hh.shop();
            orders.forEach(order => {
                let rType = order.resourceType;
                if (!(this.ledger.has(rType))) {
                    this.ledger.set(rType, new MarketEngine(rType));
                }
                this.ledger.get(rType).addOrder(order);
            });
        });
    }

    executeOrders(households: Household[]): void {
        this.report = new Map();
        this.ledger.forEach((marketEngine, resourceType) => {
            marketEngine.run();
            this.report.set(resourceType, this.generateMarketReport(marketEngine));
        });
        households.forEach(hh => {
            hh.settleMarketOrders();
        });
    }

    run(households: Household[]): void {
        this.getOrders(households);
        this.executeOrders(households);
    }

    private generateMarketReport(engine: MarketEngine): MarketReport {
        return {
            sellOrders: engine.sellOrderCount,
            buyOrders: engine.buyOrderCount,
            sellOrderDelivered: engine.sellOrderDelivered,
            buyOrderDelivered: engine.buyOrderDelivered,
            sellVolume: engine.sellVolume,
            buyVolume: engine.buyVolume,
            settlePrice: engine.settlePrice
        }
    }
}
