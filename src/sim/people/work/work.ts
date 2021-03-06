import { WorkType, WORK_TYPES, WorkLocation } from './workTypes';
import { Location, randomWalk } from '../../util/location';
import { SimProduction } from '../../util/simProduction';
import { Person } from '../person';
import { Square } from '../../../map/square';


const INITIAL_WORK_TYPE = "HUNT";
const GUILD_WORK_TYPES = ["TOOL", "HAUS", "MEDS"];


export class Work {

    readonly person: Person;

    work: string;
    produce: number;
    workLocation: Location;
    workConsumption: { [res: string]: number };
    experience: { [work: string]: number };

    constructor(person: Person) {
        this.person = person;
        this.work = INITIAL_WORK_TYPE;
        this.produce = 0;
        this.experience = {};
        this.workConsumption = {};
        this.workLocation = null;
    }

    changeWork(square: Square): void {
        let newWork = WORK_TYPES[this.work].changeFunc(this.person, square);
        this.work = newWork;
    }

    populateWorkConsumption(consumption: {[resourceType: string]: number}): void {
        this.workConsumption = {};
        for (const [key, val] of Object.entries(this.getDesiredWorkConsumption())) {
            if (key in consumption) {
                if (key === "food") {
                    let extras = consumption[key] - this.person.getBaseFoodConsumption()
                    if (extras <= 0) {
                        continue;
                    }
                    let consumed = extras > val ? val : extras;
                    this.workConsumption[key] = consumed;
                } else {
                    let consumed = consumption[key] > val ? val : consumption[key];
                    this.workConsumption[key] = consumed;
                }
            }
        }
    }

    doWork(simProduction: SimProduction): void {
        if (this.person.age < 10) {
            return;
        }
        if (this.work in this.experience) {
            this.experience[this.work]++;
        } else {
            this.experience[this.work] = 1;
        }
        for (let work in Object.keys(this.experience)) {
            if (work == this.work) continue;
            if (this.experience[work] > 0) this.experience[work]--;
        }
        let location = this.person.household.location;
        let workType = WORK_TYPES[this.work];
        if (workType.workLocation == "private") {
            this.produce = workType.produceFunc(
                    workType.strengthMod(this.person),
                    simProduction.terrain[location.y][location.x]);
            return;
        }
        this.workLocation = randomWalk(
                location,
                simProduction.terrain,
                workType.searchdist,
                workType.workLocation == WorkLocation.Water);
        simProduction.addWork(this.person, this.workLocation);
    }

    getPaid(simProduction: SimProduction): void {
        if (this.person.age < 10) {
            this.produce = 0;
            return;
        }
        let workType = WORK_TYPES[this.work];
        if (workType.workLocation == "private") {
            return;
        }
        if (this.person.id in simProduction.distributeLedger) {
            this.produce = simProduction.distributeLedger[this.person.id];
        } else {
            console.log("Did not find compensation, sue?");
            this.produce = 0;
        }
    }

    addProduceToStorage(): void {
        if (this.produce > 0) {
            let resource = WORK_TYPES[this.work].produceType;
            if (resource == "gold") {
                this.person.household.storage.addGold(this.produce);
            } else {
                this.person.household.storage.addResource(resource, this.produce);
            }
        }
    }

    getDesiredWorkConsumption(): { [resourceType: string]: number } {
        return WORK_TYPES[this.work].consume;
    }

    inheritWork(father: Person, mother: Person): void {
        if (father.work.work == mother.work.work) {
            this.work = mother.work.work;
        } else if (father.work.work == "FARM" && mother.work.work == "HUNT"
                || father.work.work == "HUNT" && mother.work.work == "FARM") {
            this.work = "FARM";
        } else if (GUILD_WORK_TYPES.includes(mother.work.work)) {
            this.work = mother.work.work
        } else if (GUILD_WORK_TYPES.includes(father.work.work)) {
            this.work = father.work.work
        } else {
            this.work = "HUNT";
        }
    }
}
