import { Square } from '../../map/square';
import { Person } from '../people/person';
import { WORK_TYPES } from '../people/work/workTypes';


export class SquareProduction {

    workRegistry: { [workType: string]: { [id: string]: number }};
    productionRegistry: { [workType: string]: number };
    distributeRegistry: { [id: string]: number };
    readonly square: Square;

    constructor(square: Square) {
        this.square = square;
        this.workRegistry = {};
        this.productionRegistry = {};
        this.distributeRegistry = {};
    }

    reset() {
        this.workRegistry = {};
        this.productionRegistry = {};
        this.distributeRegistry = {};
    }

    addRegistryItem(person: Person): void {
        let workType = person.work.work; // That's right, work work.
        let workStrength = WORK_TYPES[workType].strengthMod(
                person.work.workConsumption, person);
        if (workType in this.workRegistry) {
            this.workRegistry[workType][person.id] = workStrength;
        } else {
            this.workRegistry[workType] = {};
            this.workRegistry[workType][person.id] = workStrength;
        }
    }

    calculateProduce(): void {
        for (const [workType, registry] of Object.entries(this.workRegistry)) {
            let totalStrength = this.getStrength(workType);
            let produce = WORK_TYPES[workType].produceFunc(totalStrength, this.square);
            this.productionRegistry[workType] = produce;
            Object.entries(registry).forEach(entry => {
                let [key, val] = entry;
                this.distributeRegistry[key] = produce * val/totalStrength;
            });
        }
    }

    getStrength(workType: string): number {
        if (workType in this.workRegistry) {
            return Object.values(this.workRegistry[workType]).reduce((a, b) => a + b, 0);
        }
        return 0;
    }
}
