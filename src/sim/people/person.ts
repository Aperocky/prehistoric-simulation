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
    health: number;

    constructor(heritage: Heritage) {
        this.heritage = heritage;
        this.age = 0;
        this.id = uuid();
        this.work = new Work(this);
        this.consumption = {};
        this.health = 10;
    }

    setHousehold(household: Household): void {
        this.household = household;
    }

    getBaseFoodConsumption(): number {
        if (this.age < 15) {
            return 0.5 + (this.age)/30;
        }
        let housingEffect = 1;
        if (this.household) {
            let housing = this.household.storage.getResource(ResourceType.Haus);
            housingEffect = housing > 10 ? 0.6 : 1 - 0.04 * housing;
        }
        return housingEffect * 1;
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
        let medNeeds = this.getMedicineNeeds();
        if (medNeeds > 0) {
            desiredConsumption[ResourceType.Meds] = medNeeds;
        }
        return desiredConsumption;
    }

    getMedicineNeeds(): number {
        return this.health > 40
                ? 0
                : this.health < 20
                ? 4
                : 1;
    }

    consume(): void {
        this.consumption = {}
        for (const [key, val] of Object.entries(this.getConsumption())) {
            let percentSatisfied = this.household.percentSatisfied[key];
            this.consumption[key] = val * percentSatisfied;
        }
        // Populate work consumption
        this.work.populateWorkConsumption(this.consumption);
    }

    isHungry(): boolean {
        if (this.household === undefined) {
            // Test stub
            return this.consumption[ResourceType.Food] < this.getBaseFoodConsumption();
        }
        if (ResourceType.Food in this.consumption) {
            return this.household.percentSatisfied[ResourceType.Food] < 0.99
                    && this.consumption[ResourceType.Food] < this.getBaseFoodConsumption();
        }
        return false; // Not yet initiated
    }

    runHealth(sickChance: number): void {
        if (!(ResourceType.Food in this.consumption)) {
            throw new Error("no food consumption found");
        }
        let foodPerc = this.consumption[ResourceType.Food]/this.getBaseFoodConsumption();
        foodPerc = foodPerc > 1 ? 1 : foodPerc;
        let hungerEffect = (1 - foodPerc) * 10;
        if (this.age > 60) {
            sickChance += (this.age - 60) * 0.01;
        }
        let sickEffect = Math.random() < sickChance ? 20 : 0;
        if (ResourceType.Meds in this.consumption) {
            if (sickEffect) {
                sickEffect -= this.consumption[ResourceType.Meds] * 5;
            } else {
                this.health += 3 * this.consumption[ResourceType.Meds];
            }
        }
        let youth = (60 - this.age)/10;
        let overall = youth - sickEffect - hungerEffect;
        this.age += 1;
        this.health += overall;
        if (this.health > 100) {
            this.health = 100;
        }
    }

    getName(): string {
        return `${this.heritage.name} ${this.heritage.surname}`;
    }
}
