import { Controller } from '../../controller';
import { argparse, KeyValue } from '../parser';
import { SimMarket, MarketReport } from '../../sim/market/simMarket';
import { roundTo } from '../util';

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
    let result = ["MARKET REPORT:"];
    market.report.forEach((report, resourceType) => {
        let decimals = report.settlePrice < 0.001
                ? 5
                : report.settlePrice < 0.1
                ? 3
                : 2;
        result.push(`------- ${resourceType.toUpperCase()} ------- `);
        result.push(`Orders: BUY: ${report.buyOrders}, SELL: ${report.sellOrders}`);
        result.push(`Delivered: BUY: ${report.buyOrderDelivered}, SELL: ${report.sellOrderDelivered}`);
        result.push(`Market Volume: ${roundTo(report.buyVolume)}`);
        result.push(`Current Price: ${roundTo(report.settlePrice, decimals)}`);
        result.push(`Total Market: ${roundTo(report.buyVolume * report.settlePrice, decimals)}`);
    });
    return result;
}
