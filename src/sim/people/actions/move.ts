import { Household } from '../household';
import { Location, randomWalk, oceanCrossing } from '../../util/location';
import { ResourceType } from '../properties/resourceTypes';
import { Square } from '../../../map/square';
import { SAIL_CHANCE } from '../../../constant/simConstants';

export default function move(household: Household, terrain: Square[][]): void {
    // If hungry in current location, move.
    let foodSecurity = household.percentSatisfied[ResourceType.Food];
    let distance = 0;
    if (Math.random() > foodSecurity) {
        distance = household.dependents.length ? 8 : 10;
        if (sail(household, terrain)) {
            return;
        }
    } else if (household.isSingle) {
        distance = 3;
    }
    if (distance) {
        household.location = randomWalk(household.location, terrain, distance);
    }
}

function sail(household: Household, terrain: Square[][]): boolean {
    let loc = household.location;
    let square = terrain[loc.y][loc.x];
    if (square.isCoast && Math.random() < SAIL_CHANCE) {
        household.location = oceanCrossing(loc, terrain, 20, 5);
        return true;
    }
    return false;
}
