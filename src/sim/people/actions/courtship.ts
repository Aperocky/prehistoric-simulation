import { Household } from '../household';
import { Person } from '../person';
import { Location } from '../../util/location';

export default function courtship(girl: Person, boy: Person): boolean {
    if (girl.heritage.father == boy.heritage.father 
            || girl.heritage.mother == boy.heritage.mother) {
        return false; // No Siblings
    }
    let ageDiff = Math.abs(girl.age - boy.age);
    let chance = 0.75 - 0.05 * ageDiff + (girl.isHungry() == boy.isHungry() ? 0 : 0.5);
    return Math.random() < chance;
}
