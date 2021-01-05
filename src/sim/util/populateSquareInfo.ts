import { Simulation } from '../sim';


export default function populateSquareInfo(sim: Simulation): void {
    let size = sim.terrain.length;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let square = sim.terrain[y][x];
            square.simInfo.households = [];
            square.simInfo.people = [];
            square.simInfo.farmerCount = 0;
            square.simInfo.isFarm = false;
        }
    }
    sim.households.forEach(hh => hh.populateSquareInfo(sim));
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let square = sim.terrain[y][x];
            if (square.simInfo.farmerCount > 10
                && square.simInfo.people.length < 50) {
                square.simInfo.isFarm = true;
            }
        }
    }
}
