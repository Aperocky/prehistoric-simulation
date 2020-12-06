import { Household } from './household';
import { ORIGIN_NAME } from '../../constant/simConstants';
import { v4 as uuid } from 'uuid';
import { Heritage } from './properties/heritage';
import { Work } from './work/work';


export class Person {

    id: string;
    heritage: Heritage;
    age: number;
    work: Work;

    constructor(heritage: Heritage) {
        this.heritage = heritage;
        this.age = 0;
        this.id = uuid();
        this.work = new Work();
    }
}
