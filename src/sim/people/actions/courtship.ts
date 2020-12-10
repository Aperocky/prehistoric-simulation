import { Household } from '../household';
import { Person } from '../person';
import { Location } from '../../util/location';
import { ORIGIN_NAME } from '../../../constant/simConstants';

export default function courtship(girl: Person, boy: Person): boolean {
    if ((girl.heritage.father == boy.heritage.father 
            || girl.heritage.mother == boy.heritage.mother)
            && girl.heritage.mother != ORIGIN_NAME
            && boy.heritage.mother != ORIGIN_NAME) {
        return false; // No Siblings
    }
    let ageDiff = Math.abs(girl.age - boy.age);
    let chance = 0.75 - 0.05 * ageDiff + (girl.isHungry() == boy.isHungry() ? 0 : 0.5);
    return Math.random() < chance;
}
