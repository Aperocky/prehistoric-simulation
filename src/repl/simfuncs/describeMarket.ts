import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { SimMarket, MarketReport } from '../../sim/market/simMarket';
import { roundTo, createTable } from '../util';

const HELP = [
    "describe current market",
];

export default function describeMarket(controller: Controller, ...args: string[]): string[] {
    let kvps = argparse(args);
    if (kvps.length) {
        if (kvps[0].key == "help") {
            return HELP;
        }
    }
    return describe(controller.simulation.simMarket);
}

function describe(market: SimMarket): string[] {
    let result = [];
    result.push(...orderTable(market));
    result.push(...marketTable(market));
    return result;
}

function orderTable(market: SimMarket): string[] {
    let title = "ORDERS";
    let header = ["RESOURCE", "BUYS", "DELIVERED", "SELL", "SOLD"];
    let rows: string[][] = [];
    let totalBuyOrders = 0;
    let totalSellOrders = 0;
    let totalBuyOrderDelivered = 0;
    let totalSellOrderDelivered = 0;
    market.report.forEach((report, resourceType) => {
        rows.push([
            resourceType.toUpperCase(),
            report.buyOrders.toString(),
            report.buyOrderDelivered.toString(),
            report.sellOrders.toString(),
            report.sellOrderDelivered.toString(),
        ]);
        totalBuyOrders += report.buyOrders; 
        totalSellOrders += report.sellOrders; 
        totalBuyOrderDelivered += report.buyOrderDelivered; 
        totalSellOrderDelivered += report.sellOrderDelivered; 
    });
    rows.push([
        "TOTAL",
        totalBuyOrders.toString(),
        totalBuyOrderDelivered.toString(),
        totalSellOrders.toString(),
        totalSellOrderDelivered.toString()
    ]);
    return createTable(title, header, rows);
}

function marketTable(market: SimMarket): string[] {
    let title = "MARKET";
    let header = ["RESOURCE", "QUANTITY", "PRICE", "TOTAL"];
    let rows: string[][] = [];
    let totalQuantity = 0;
    let totalVolume = 0;
    market.report.forEach((report, resourceType) => {
        let decimals = report.settlePrice < 0.001
                ? 5
                : report.settlePrice < 0.1
                ? 3
                : 2;
        rows.push([
            resourceType.toUpperCase(),
            roundTo(report.buyVolume).toString(),
            roundTo(report.settlePrice, decimals).toString(),
            roundTo(report.buyVolume * report.settlePrice, decimals).toString()
        ]);
        totalQuantity += report.buyVolume;
        totalVolume += report.buyVolume * report.settlePrice;
    });
    rows.push([
        "TOTAL",
        roundTo(totalQuantity).toString(),
        "-",
        roundTo(totalVolume).toString()
    ]);
    return createTable(title, header, rows);
}
