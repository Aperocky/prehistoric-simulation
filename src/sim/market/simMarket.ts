import { Order, MarketTransactionsEngine, MarketDataForResource } from 'market-transactions-engine';
import { Household } from '../people/household';

// export type MarketReport = {
//     sellOrders: number;
//     buyOrders: number;
//     sellOrderDelivered: number;
//     buyOrderDelivered: number;
//     sellVolume: number;
//     buyVolume: number;
//     settlePrice: number;
// }

export class SimMarket {

    engine: MarketTransactionsEngine;
    report: Map<string, MarketDataForResource>;

    constructor() {
        this.engine = new MarketTransactionsEngine();
        this.report = new Map();
    }

    getOrders(households: Household[]): void {
        this.engine.resetMarket();
        households.forEach(hh => {
            let orders = hh.shop();
            this.engine.addOrders(orders);
        });
    }

    executeOrders(households: Household[]): void {
        this.engine.processOrders();
        households.forEach(hh => {
            hh.settleMarketOrders();
        });
        this.report = this.engine.getData();
    }

    run(households: Household[]): void {
        this.getOrders(households);
        this.executeOrders(households);
    }
}
