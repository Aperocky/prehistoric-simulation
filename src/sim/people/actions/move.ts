import { Household } from '../household';
import { Person } from '../person';
import { Location, randomWalk } from '../../util/location';
import { ResourceType } from '../properties/resourceTypes';
import { Square } from '../../../map/square';

export default function move(household: Household, terrain: Square[][]): void {
    // If hungry in current location, move.
    let foodSecurity = household.percentSatisfied[ResourceType.Food];
    let distance = 0;
    if (Math.random() > foodSecurity) {
        distance = household.dependents.length ? 3 : 5;
    } else if (household.isSingle) {
        distance = 3;
    }
    if (distance) {
        household.location = randomWalk(household.location, terrain, distance);
    }
}
