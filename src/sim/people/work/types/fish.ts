import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';
import { Person } from '../../person';


function changeFunc(person: Person, square: Square): string {
    if (!square.isCoast) {
        return "HUNT";
    }
    return "FISH";
}


export const Fisher: WorkType = {
    name: "Fisher",
    consume: {"wood": 0.3},
    strengthMod: (person) => {
        let woodMultiplier = 0.5
        let consumed = person.work.workConsumption;
        if (ResourceType.Wood in consumed) {
            return (0.1 - consumed[ResourceType.Wood])/0.2 + 0.5;
        }
        return defaultAgeMod(person) * woodMultiplier * 8;
    },
    produceFunc: (strength, square) => {
        let depthMultiplier = 2 + square.altitude/500;
        return strength**0.6 * depthMultiplier;
    },
    changeFunc: changeFunc,
    searchdist: 5,
    workLocation: WorkLocation.Water,
    produceType: ResourceType.Food
}
