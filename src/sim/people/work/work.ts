import { WorkType, WORK_TYPES, WorkLocation } from './workTypes';
import { Location, randomWalk } from '../../util/location';
import { SimProduction } from '../../util/simProduction';
import { Person } from '../person';
import { Square } from '../../../map/square';

const INITIAL_WORK_TYPE = "HUNT";

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

    doWork(simProduction: SimProduction): void {
        if (this.person.age < 10) {
            return;
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
            this.person.household.storage.addResource(resource, this.produce);
        }
    }

    getDesiredWorkConsumption(): { [resourceType: string]: number } {
        return WORK_TYPES[this.work].consume;
    }
}
