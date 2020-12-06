import { WorkType, WORK_TYPES, WorkLocation } from './workTypes';
import { Location, randomWalk } from '../../util/location';
import { SimProduction } from '../../util/simProduction';
import { Person } from '../person';

const INITIAL_WORK_TYPE = "HUNT";

export class Work {

    work: string;
    produce: number;
    workConsumption: { [res: string]: number };
    experience: { [work: string]: number };

    constructor() {
        this.work = INITIAL_WORK_TYPE;
        this.produce = 0;
        this.experience = {};
        this.workConsumption = {};
    }

    doWork(simProduction: SimProduction, location: Location, person: Person): void {
        let workType = WORK_TYPES[this.work];
        if (workType.workLocation == "private") {
            this.produce = workType.produceFunc(
                    workType.strengthMod(this.workConsumption, person),
                    simProduction.terrain[location.y][location.x]);
            return;
        }
        let workLocation = randomWalk(
                location,
                simProduction.terrain,
                workType.searchdist,
                workType.workLocation == WorkLocation.Water);
        simProduction.addWork(person, workLocation);
    }

    getPaid(simProduction: SimProduction, person: Person): number {
        let workType = WORK_TYPES[this.work];
        if (workType.workLocation == "private") {
            return;
        }
        if (person.id in simProduction.distribute) {
            this.produce = simProduction.distribute[person.id];
        } else {
            console.log("Did not find compensation, sue?");
            this.produce = 0;
        }
    }
}
