import { SquareProduction } from './squareProduction';
import { Location } from './location';
import { Square } from '../../map/square';


// Public production board
export class SimProduction {

    readonly size: number;
    readonly terrain: Square[][];
    board: SquareProduction[][];
    distribute: { [id: string] : number };

    constructor(terrain: Square[][]) {
        this.size = terrain.length;
        this.terrain = terrain;
        this.distribute = {};
        this.createBoard();
    }

    reset(): void {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.board[y][x].reset();
            }
        }
        this.distribute = {};
    }

    private createBoard(): void {
        this.board = [];
        for (let y = 0; y < this.size; y++) {
            let latitude: SquareProduction[] = [];
            for (let x = 0; x < this.size; x++) {
                latitude.push(new SquareProduction(this.terrain[y][x]));
            }
            this.board.push(latitude);
        }
    }

    addWork(person, location): void {
        this.board[location.y][location.x].addRegistryItem(person);
    }

    calculate(): void {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.board[y][x].calculateProduce();
                Object.entries(this.board[y][x].distributeRegistry).forEach(entry => {
                    let [key, val] = entry;
                    this.distribute[key] = val;
                });
            }
        }
    }
}
