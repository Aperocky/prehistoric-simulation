import { Person } from './person';
import { Storage } from './properties/storage';
import { Location } from '../util/location';
import { SimProduction } from '../util/simProduction';

export class Household {

    holderId: string;
    location: Location;
    isSingle: boolean;
    adults: Person[];
    dependents: Person[];
    storage: Storage;

    projectedConsumption: { [resourceType: string]: number };
    percentSatisfied: { [resourceType: string]: number };

    constructor(households: Household[], person?: Person, location?: Location) {
        this.storage = new Storage();
        if (households.length) {
            this.location = households[0].location;
            this.holderId = households[0].holderId;
            this.adults = [].concat(...households.map(h => h.adults));
            this.isSingle = this.adults.length == 1;
            this.dependents = [].concat(...households.map(h => h.dependents));
            this.storage.mergeStorages(households.map(h => h.storage));
            [].concat(...[this.adults, this.dependents]).map(p => {
                p.setHousehold(this);
            });
        } else if (person && location) {
            this.location = location;
            this.holderId = person.id;
            this.isSingle = true;
            this.adults = [person];
            this.dependents = [];
            person.setHousehold(this);
        } else {
            throw new TypeError("incomplete parameter exception");
        }
        this.projectedConsumption = {};
        this.percentSatisfied = {};
    }

    getProjectedConsumption(): void {
        let consumption = {};
        [].concat(...[this.adults, this.dependents]).map(p => {
            let pc = p.getConsumption();
            for (const [key, val] of Object.entries(pc)) {
                if (key in consumption) {
                    consumption[key] += val;
                } else {
                    consumption[key] = val;
                }
            }
        });
        this.projectedConsumption = consumption;
    }

    consume(): void {
        this.percentSatisfied = {};
        for (const [key, val] of Object.entries(this.projectedConsumption)) {
            let actual = this.storage.spendResource(key, val);
            this.percentSatisfied[key] = actual/val;
        }
        [].concat(...[this.adults, this.dependents]).map(p => {
            p.consume();
        });
    }
}
