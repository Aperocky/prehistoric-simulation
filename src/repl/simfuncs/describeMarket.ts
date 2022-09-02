import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { SimMarket } from '../../sim/market/simMarket';
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
            report.buyOrdersCount.toString(),
            report.buyOrdersDelivered.toString(),
            report.sellOrdersCount.toString(),
            report.sellOrdersDelivered.toString(),
        ]);
        totalBuyOrders += report.buyOrdersCount;
        totalSellOrders += report.sellOrdersCount;
        totalBuyOrderDelivered += report.buyOrdersDelivered;
        totalSellOrderDelivered += report.sellOrdersDelivered;
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
        let decimals = report.actualPrice < 0.001
                ? 5
                : report.actualPrice < 0.1
                ? 3
                : 2;
        rows.push([
            resourceType.toUpperCase(),
            roundTo(report.actualVolume).toString(),
            roundTo(report.actualPrice, decimals).toString(),
            roundTo(report.actualVolume * report.actualPrice, decimals).toString()
        ]);
        totalQuantity += report.actualVolume;
        totalVolume += report.actualVolume * report.actualPrice;
    });
    rows.push([
        "TOTAL",
        roundTo(totalQuantity).toString(),
        "-",
        roundTo(totalVolume).toString()
    ]);
    return createTable(title, header, rows);
}
