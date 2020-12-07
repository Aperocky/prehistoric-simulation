import { SquareProduction } from './squareProduction';
import { Location } from './location';
import { Square } from '../../map/square';
import { Person } from '../people/person';
import { Household } from '../people/household';


// Public production board
export class SimProduction {

    readonly size: number;
    readonly terrain: Square[][];
    board: SquareProduction[][];
    distributeLedger: { [id: string] : number };

    constructor(terrain: Square[][]) {
        this.size = terrain.length;
        this.terrain = terrain;
        this.distributeLedger = {};
        this.createBoard();
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

    reset(): void {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.board[y][x].reset();
            }
        }
        this.distributeLedger = {};
    }

    calculate(): void {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.board[y][x].calculateProduce();
                Object.entries(this.board[y][x].distributeRegistry).forEach(entry => {
                    let [key, val] = entry;
                    this.distributeLedger[key] = val;
                });
            }
        }
    }

    work(people: { [id: string]: Person }): void {
        Object.values(people).forEach(p => {
            p.work.doWork(this);
        });
    }

    distribute(people: { [id: string]: Person }): void {
        Object.values(people).forEach(p => {
            p.work.getPaid(this);
            p.work.addProduceToStorage();
        });
    }

    // Invoke once per turn for recording and rewarding work
    globalWorkIteration(people: { [id: string]: Person }): void {
        this.reset();
        this.work(people);
        this.calculate();
        this.distribute(people);
    }
}
