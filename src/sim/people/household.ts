import { Person } from './person';
import { Storage } from './properties/storage';
import { Location, getTerrainFromLocation } from '../util/location';
import { Square, Terrain } from '../../map/square';
import { childHeritage } from './properties/heritage';
import { ResourceType } from './properties/resourceTypes';
import { v4 as uuid } from 'uuid';
import { SICK_PROBABILITY } from '../../constant/mapConstants';


export class Household {

    id: string;
    holderId: string;
    location: Location;
    isSingle: boolean;
    adults: Person[];
    dependents: Person[];
    storage: Storage;

    projectedConsumption: { [resourceType: string]: number };
    percentSatisfied: { [resourceType: string]: number };

    constructor(households: Household[], person?: Person, location?: Location) {
        this.id = uuid();
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
        this.allDo(p => p.consume());
    }

    birth(): Person | null {
        if (this.isSingle) {
            return null;
        }
        if (!(ResourceType.Food in this.percentSatisfied)) {
            throw new Error("Process failure, food not populated");
        }
        let man = this.getRandomAdultByGender(1);
        let woman = this.getRandomAdultByGender(0);
        if (man == null || woman == null) {
            return null;
        }
        if (Math.random() < this.birthChance(woman)) {
            let baby = new Person(childHeritage(man, woman));
            this.dependents.push(baby);
            man.heritage.children.push(baby.id);
            woman.heritage.children.push(baby.id);
            return baby;
        }
        return null;
    }

    runTurn(map: Square[][]): void {
        let terrain = getTerrainFromLocation(map, this.location);
        let sickProbability = SICK_PROBABILITY.get(terrain);
        this.allDo(p => p.runHealth(sickProbability));
    }

    birthChance(woman: Person): number {
        let ageEffect = woman.age < 25
                ? (25 - woman.age)**2 * 0.004
                : (woman.age - 25) * 0.03;
        let foodEffect = (1 - this.percentSatisfied[ResourceType.Food]) * 2
        return 0.6 - ageEffect - foodEffect;
    }

    private getRandomAdultByGender(gender: number): Person | null {
        let currSex = this.adults.filter(p => p.heritage.gender == gender); // open to progressive ideas
        if (currSex.length) {
            return currSex[Math.floor(Math.random() * currSex.length)];
        } else {
            return null;
        }
    }

    private allDo(func: (person: Person) => void): void {
        [].concat(...[this.adults, this.dependents]).map(func);
    }
}
