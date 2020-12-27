import { Order } from './order';


export class MarketEngine {

    resourceType: string;
    sellOrders: Order[];
    buyOrders: Order[];
    completedOrder: Order[];
    settlePrice: number;

    constructor(resourceType: string) {
        this.resourceType = resourceType;
        this.sellOrders = [];
        this.buyOrders = [];
        this.completedOrder = [];
        this.settlePrice = 0;
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
    }

    match(): number {
        let currPrice = 0;
        if (!this.buyOrders.length || !this.sellOrders.length) {
            return; // Nothing is sold.
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
                break;
            }

            currPrice = currSellOrder.unitPrice;
            // Main loop
            if (currSold > currBought) {
                // More is sold, bump to the next buy order
                this.completedOrder.push(currBuyOrder);
                if (this.buyOrders.length) {
                    currBuyOrder = this.buyOrders.pop();
                    currBought += currBuyOrder.quantity;
                } else {
                    this.sellOrders.push(currSellOrder);
                    currPrice = currSellOrder.unitPrice;
                    break;
                }
            } else if (currSold == currBought) {
                // edge case
                this.completedOrder.push(currBuyOrder);
                this.completedOrder.push(currSellOrder);
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
                this.completedOrder.push(currSellOrder);
                if (this.sellOrders.length) {
                    currSellOrder = this.sellOrders.pop();
                    currSold += currSellOrder.quantity;
                } else {
                    // Current buy order is unfulfilled, push it back
                    this.buyOrders.push(currBuyOrder);
                    currPrice = currBuyOrder.unitPrice;
                    break;
                }
            }
        }
        return currPrice;
    }

    run(): void {
        this.sortOrders();
        let price = this.match();
        this.completedOrder.forEach(order => {
            order.markComplete(price);
        });
        this.settlePrice = price;
    }
}
