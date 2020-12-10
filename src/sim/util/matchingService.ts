import { Household } from '../people/household';
import { Simulation } from '../sim';
import courtship from '../people/actions/courtship';


/*
Perform simple matching services for single households
Matched couples move like EU4 generals and admirals.
*/
export default function matchingService(sim: Simulation): number {
    let singles = Array.from(sim.households.values()).filter(hh => hh.isSingle);
    let girls = singles.filter(hh => !hh.adults[0].heritage.gender);
    let boys = singles.filter(hh => hh.adults[0].heritage.gender);
    let matched: Set<string> = new Set();
    boys.forEach(boy => {
        let girl = girls[Math.floor(Math.random()*girls.length)];
        if (matched.has(girl.id)) {
            return; // Love is taken.
        } else if (courtship(girl.adults[0], boy.adults[0])) {
            let couple = new Household([boy, girl]);
            sim.households.set(couple.id, couple);
            sim.households.delete(girl.id);
            sim.households.delete(boy.id);
            matched.add(girl.id);
        }
    });
    return matched.size;
}
