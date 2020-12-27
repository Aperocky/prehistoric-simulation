
export class Order {

    source: string;
    resourceType: string;
    quantity: number; // Resource Amount
    amount: number; // Gold Amount
    orderType: boolean; // true: buy, false: sell

    // internal attribute
    unitPrice: number;

    // Settlement
    settlePrice: number;
    delivered: boolean;

    constructor(source: string, resourceType: string, quantity: number,
            amount: number, orderType: boolean) {
        this.source = source;
        this.resourceType = resourceType;
        this.quantity = quantity;
        this.amount = amount;
        this.orderType = orderType;
        this.unitPrice = this.amount/this.quantity;
        this.delivered = false;
    }

    markComplete(price: number): void {
        this.delivered = true;
        this.settlePrice = price;
    }
}
