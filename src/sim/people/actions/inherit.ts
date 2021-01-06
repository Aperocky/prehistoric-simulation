import { Household } from '../household';
import { Simulation } from '../../sim';
import { ResourceType } from '../properties/resourceTypes';


export default function inherit(household: Household, sim: Simulation): void {
    if (!household.isSingle) {
        throw new Error("household is not single");
    }
    let person = household.adults[0];
    let children = person.heritage.children;
    if (children.length) {
        let alive: Household[] = children.filter(c => sim.people.has(c))
                .map(c => sim.people.get(c).household);
        let sameLoc = alive.filter(c => c.location.x == household.location.x 
                && c.location.y == household.location.y);
        let house = household.storage.getResource(ResourceType.Haus);
        if (sameLoc.length && house) {
            sameLoc.forEach(c => {
                c.storage.addResource(ResourceType.Haus, house/sameLoc.length);
            });
        }
        if (alive.length) {
            for (const [key, val] of Object.entries(household.storage.storage)) {
                if (key == ResourceType.Haus) {
                    continue;
                }
                if (val) {
                    alive.forEach(c => {
                        c.storage.addResource(key, val/alive.length);
                    });
                }
            }
        }
    }
}
