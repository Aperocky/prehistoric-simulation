import { Household } from './household';
import { ORIGIN_NAME } from '../../constant/simConstants';
import { v4 as uuid } from 'uuid';
import { Heritage } from './properties/heritage';
import { Work } from './work/work';
import { ResourceType } from './properties/resourceTypes';


export class Person {

    household: Household;

    id: string;
    heritage: Heritage;
    age: number;
    work: Work;
    consumption: { [resourceType: string]: number };

    constructor(heritage: Heritage) {
        this.heritage = heritage;
        this.age = 0;
        this.id = uuid();
        this.work = new Work(this);
        this.consumption = {};
    }

    setHousehold(household: Household): void {
        this.household = household;
    }

    getBaseFoodConsumption(): number {
        if (this.age < 15) {
            return 0.5 + (this.age)/30;
        }
        return 1;
    }

    getConsumption(): { [resourceType: string]: number } {
        let desiredConsumption = {};
        desiredConsumption[ResourceType.Food] = this.getBaseFoodConsumption();
        // Add desired
        for (const [key, val] of Object.entries(this.work.getDesiredWorkConsumption())) {
            if (key in desiredConsumption) {
                desiredConsumption[key] += val;
            } else {
                desiredConsumption[key] = val;
            }
        }
        return desiredConsumption;
    }

    consume(): void {
        this.consumption = {}
        for (const [key, val] of Object.entries(this.getConsumption())) {
            let percentSatisfied = this.household.percentSatisfied[key];
            this.consumption[key] = val * percentSatisfied;
        }
    }

    isHungry(): boolean {
        if (ResourceType.Food in this.consumption) {
            return this.consumption[ResourceType.Food] < this.getBaseFoodConsumption();
        }
        return false; // Not yet initiated
    }
}
