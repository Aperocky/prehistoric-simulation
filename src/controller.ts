import { Square } from './map/square';
import generateTerrain from './map/generateTerrain';
import * as mapConstants from './constant/displayConstants';
import { MapCanvas } from './view/mapCanvas';
import { ReplTerminal } from './view/replTerminal';


// Logical aggregation of everything.
export class Controller {

    terrain: Square[][];
    mapCanvas: MapCanvas;
    replTerminal: ReplTerminal;

    constructor() {
        this.mapCanvas = new MapCanvas();
        this.replTerminal = new ReplTerminal(this);
        this.generateTerrain()
    }

    generateTerrain() {
        this.terrain = generateTerrain(mapConstants.DEFAULT_MAP_SIZE);
        this.mapCanvas.createMapSprites(this.terrain);
        this.mapCanvas.createTerrainHooks(this.replTerminal);
    }
}
