
export class Storage {
    
    storage: { [resource: string]: number };
    gold: number;

    constructor() {
        this.storage = {};
        this.gold = 0;
    }

    // Food spoils
    spoils(): void {
        if (this.getResource("food")) {
            this.spendResource("food", this.getResource("food") * 0.2);
        }
    }

    mergeStorages(storages: Storage[]): void {
        storages.forEach(s => {
            this.addGold(s.gold);
            for (const [res, val] of Object.entries(s.storage)) {
                this.addResource(res, val);
            }
        });
    }

    addGold(count: number): void {
        this.gold += count;
    }

    spendGold(count: number): void {
        // Can go into debt!
        this.gold -= count;
    }

    getResource(resourceType: string): number {
        if (resourceType in this.storage) {
            return this.storage[resourceType];
        }
        return 0;
    }

    addResource(resourceType: string, count: number): void {
        if (resourceType in this.storage) {
            this.storage[resourceType] += count;
        } else {
            this.storage[resourceType] = count;
        }
    }

    spendResource(resourceType: string, count: number): number {
        if (resourceType in this.storage) {
            let currAmount = this.storage[resourceType];
            if (currAmount >= count) {
                this.storage[resourceType] -= count;
                return count;
            } else {
                this.storage[resourceType] = 0;
                return currAmount;
            }
        } else {
            return 0;
        }
    }
}
