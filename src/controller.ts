import { Square } from './map/square';
import generateTerrain from './map/generateTerrain';
import { MapCanvas } from './view/mapCanvas';


export class Controller {

    terrain: Square[][];
    mapCanvas: MapCanvas;

    constructor() {
        this.terrain = generateTerrain(50);
        this.mapCanvas = new MapCanvas();
        this.mapCanvas.createMapSprites(this.terrain);
    }
}
