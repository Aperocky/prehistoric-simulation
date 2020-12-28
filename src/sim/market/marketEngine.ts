import { Order } from './order';


export class MarketEngine {

    resourceType: string;
    sellOrders: Order[];
    buyOrders: Order[];
    completedOrders: Order[];

    // Information
    settlePrice: number;
    sellOrderCount: number;
    buyOrderCount: number;
    sellOrderDelivered: number;
    buyOrderDelivered: number;
    sellVolume: number;
    buyVolume: number;

    constructor(resourceType: string) {
        this.resourceType = resourceType;
        this.sellOrders = [];
        this.buyOrders = [];
        this.completedOrders = [];
        this.settlePrice = 0;
        this.sellOrderCount = 0;
        this.buyOrderCount = 0;
        this.sellOrderDelivered = 0;
        this.buyOrderDelivered = 0;
        this.sellVolume = 0;
        this.buyVolume = 0;
    }

    addOrder(order: Order) {
        if (order.orderType) {
            this.buyOrders.push(order);
        } else {
            this.sellOrders.push(order);
        }
    }

    sortOrders(): void {
        // order by unitPrice, cheap -> expensive
        this.buyOrders.sort((a, b) => a.unitPrice - b.unitPrice);
        // order by unitPrice, expensive -> cheap
        this.sellOrders.sort((a, b) => b.unitPrice - a.unitPrice);
        this.buyOrderCount = this.buyOrders.length;
        this.sellOrderCount = this.sellOrders.length;
        this.buyOrderDelivered = 0;
        this.sellOrderDelivered = 0;
    }

    match(): number {
        let currPrice = 0;
        if (!this.buyOrders.length || !this.sellOrders.length) {
            return 0; // Nothing is sold.
        }
        let currSellOrder = this.sellOrders.pop();
        let currBuyOrder = this.buyOrders.pop();
        let currSold = currSellOrder.quantity;
        let currBought = currBuyOrder.quantity;

        // Slight descrepancy no larger than a single order will
        // exist in this system.
        while (true) {
            // Break Condition:
            // max offer price is smaller than min sell price
            if (currBuyOrder.unitPrice < currSellOrder.unitPrice) {
                this.sellOrders.push(currSellOrder);
                this.buyOrders.push(currBuyOrder);
                currSold -= currSellOrder.quantity;
                currBought -= currBuyOrder.quantity;
                break;
            }

            currPrice = currSellOrder.unitPrice;
            // Main loop
            if (currSold > currBought) {
                // More is sold, bump to the next buy order
                this.completedOrders.push(currBuyOrder);
                this.buyOrderDelivered++;
                if (this.buyOrders.length) {
                    currBuyOrder = this.buyOrders.pop();
                    currBought += currBuyOrder.quantity;
                } else {
                    this.completedOrders.push(currSellOrder);
                    this.sellOrderDelivered++;
                    currPrice = currSellOrder.unitPrice;
                    break;
                }
            } else if (currSold == currBought) {
                // edge case
                this.completedOrders.push(currBuyOrder);
                this.completedOrders.push(currSellOrder);
                this.buyOrderDelivered++;
                this.sellOrderDelivered++;
                if (this.buyOrders.length && this.sellOrders.length) {
                    currBuyOrder = this.buyOrders.pop();
                    currSellOrder = this.sellOrders.pop();
                    currBought += currBuyOrder.quantity;
                    currSold += currSellOrder.quantity;
                } else {
                    currPrice = currSellOrder.unitPrice;
                    break;
                }
            } else {
                // More is bought, bump to the next sell order
                this.completedOrders.push(currSellOrder);
                this.sellOrderDelivered++;
                if (this.sellOrders.length) {
                    currSellOrder = this.sellOrders.pop();
                    currSold += currSellOrder.quantity;
                } else {
                    this.completedOrders.push(currBuyOrder);
                    this.buyOrderDelivered++;
                    currPrice = currBuyOrder.unitPrice;
                    break;
                }
            }
        }
        this.sellVolume = currSold;
        this.buyVolume = currBought;
        return currPrice;
    }

    run(): void {
        this.sortOrders();
        let price = this.match();
        this.completedOrders.forEach(order => {
            order.markComplete(price);
        });
        this.settlePrice = price;
    }
}
