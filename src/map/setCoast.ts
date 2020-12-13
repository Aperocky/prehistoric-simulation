import { Square } from './square';


export default function setCoast(terrain: Square[][]): void {
    let size = terrain.length;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let square = terrain[y][x];
            if (square.isWater()) {
                break;
            }
            let adjacents = getAdjacentLocations(x, y);
            adjacents.forEach(adj => {
                if (adj[0] < 0 || adj[0] >= size || adj[1] < 0 || adj[1] >= size) {
                    return;
                }
                let adjacentSquare = terrain[adj[1]][adj[0]];
                if (adjacentSquare.isWater()) {
                    square.setCoast();
                }
            });
        }
    }
}

function getAdjacentLocations(x: number, y: number): number[][] {
    return [[x+1, y], [x, y+1], [x-1, y], [x, y-1]];
}
