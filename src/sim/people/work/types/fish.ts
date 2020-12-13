import { WorkType, WorkLocation, defaultAgeMod } from '../workTypes';
import { Square } from '../../../../map/square';
import { ResourceType } from '../../properties/resourceTypes';


export const Fisher: WorkType = {
    name: "Fisher",
    consume: {"wood": 0.3},
    strengthMod: (consumed, person) => {
        let woodMultiplier = 0.5
        if (ResourceType.Wood in consumed) {
            return (0.1 - consumed[ResourceType.Wood])/0.2 + 0.5;
        }
        return defaultAgeMod(person) * woodMultiplier;
    },
    produceFunc: (strength, square) => {
        let depthMultiplier = 2 + square.altitude/500;
        return Math.sqrt(strength) * depthMultiplier;
    },
    searchdist: 5,
    workLocation: WorkLocation.Water,
    produceType: ResourceType.Food
}
