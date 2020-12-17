import { Person } from './person';
import { Storage } from './properties/storage';
import { Simulation } from '../sim';
import { Location, getTerrainFromLocation } from '../util/location';
import { Square, Terrain } from '../../map/square';
import { childHeritage } from './properties/heritage';
import { ResourceType } from './properties/resourceTypes';
import move from './actions/move';
import { v4 as uuid } from 'uuid';
import { SICK_PROBABILITY } from '../../constant/mapConstants';


export class Household {

    id: string;
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
            this.adults = [].concat(...households.map(h => h.adults));
            this.isSingle = this.adults.length == 1;
            this.dependents = [].concat(...households.map(h => h.dependents));
            this.storage.mergeStorages(households.map(h => h.storage));
            [].concat(...[this.adults, this.dependents]).map(p => {
                p.setHousehold(this);
            });
        } else if (person && location) {
            this.location = location;
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

    changeWork(sim: Simulation): void {
        let square = sim.terrain[this.location.y][this.location.x];
        this.allDo(p => {
            if (p.age < 10) {
                return;
            }
            p.work.changeWork(square);
        });
    }

    runTurn(sim: Simulation): void {
        this.runHealth(sim);
        if (sim.households.has(this.id)) {
            let baby = this.birth();
            if (baby != null) {
                sim.people.set(baby.id, baby);
            }
        }
        move(this, sim.terrain);
        this.adulthood(sim);
        this.storage.spoils();
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
            baby.setHousehold(this);
            man.heritage.children.push(baby.id);
            woman.heritage.children.push(baby.id);
            return baby;
        }
        return null;
    }

    runHealth(sim: Simulation): void {
        let terrain = getTerrainFromLocation(sim.terrain, this.location);
        let sickProbability = SICK_PROBABILITY.get(terrain);
        this.allDo(p => p.runHealth(sickProbability));
        this.mortality(sim);
    }

    birthChance(woman: Person): number {
        let ageEffect = woman.age < 25
                ? (25 - woman.age)**2 * 0.004
                : (woman.age - 25) * 0.03;
        let foodEffect = (1 - this.percentSatisfied[ResourceType.Food]) * 2
        return (0.6 - ageEffect - foodEffect) * 0.8;
    }

    adulthood(sim: Simulation): void {
        if (!(this.dependents.length)) {
            return;
        }
        let largestSibling = this.dependents[0];
        if (largestSibling.age > 18) {
            this.dependents.shift();
            let household = new Household([], largestSibling, this.location);
            let gift: number = this.storage.getResource(ResourceType.Food)/(this.dependents.length + 4)
            household.storage.addResource(ResourceType.Food, gift);
            this.storage.spendResource(ResourceType.Food, gift);
            sim.households.set(household.id, household);
        } else if (this.percentSatisfied[ResourceType.Food] < 1) {
            let scarcity = (1 - this.percentSatisfied[ResourceType.Food]) * 10;
            if (largestSibling.age > 18 - scarcity) {
                this.dependents.shift();
                let household = new Household([], largestSibling, this.location);
                sim.households.set(household.id, household);
            }
        }
    }

    totalPersons(): number {
        return this.dependents.length + this.adults.length;
    }

    populateSquareInfo(sim: Simulation): void {
        let square = sim.terrain[this.location.y][this.location.x];
        square.simInfo.households.push(this);
        this.allDo(p => square.simInfo.people.push(p));
    }

    private mortality(sim: Simulation): void {
        this.adults.forEach(p => {
            if (p.health < 0) {
                this.funeral(sim, p, true);
            }
        });
        this.dependents.forEach(p => {
            if (p.health < 0) {
                this.funeral(sim, p, false);
            }
        });
    }

    private funeral(sim: Simulation, deceased: Person, adult: boolean): void {
        sim.people.delete(deceased.id);
        if (adult) {
            if (this.isSingle) {
                if (this.dependents.length) {
                    let oldest = this.dependents.shift();
                    this.adults = [oldest];
                } else {
                    sim.households.delete(this.id);
                }
            } else {
                this.adults = this.adults.filter(p => p.id != deceased.id);
                if (this.adults.length == 1) {
                    this.isSingle = true;
                }
            }
        } else {
            this.dependents = this.dependents.filter(p => p.id != deceased.id);
        }
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
