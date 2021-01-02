import { Simulation } from '../sim';


export default function populateSquareInfo(sim: Simulation): void {
    let size = sim.terrain.length;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let square = sim.terrain[y][x];
            square.simInfo.households = [];
            square.simInfo.people = [];
            square.simInfo.farmerCount = 0;
        }
    }
    sim.households.forEach(hh => hh.populateSquareInfo(sim));
}
