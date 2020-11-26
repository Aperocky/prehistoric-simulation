import * as PIXI from 'pixi.js';
import * as displayConstants from '../constant/displayConstants';
import { MapSprite } from './base/mapSprite';
import { Square } from '../map/square';

// A logical aggregation of all canvas operations
export class MapCanvas {

    app: PIXI.Application;
    mainContainer: PIXI.Container;
    mapSprites: MapSprite[];

    constructor() {
        this.app = new PIXI.Application({
                width: displayConstants.DEFAULT_DISPLAY_WIDTH,
                height: displayConstants.DEFAULT_DISPLAY_HEIGHT
        });
        this.mainContainer = new PIXI.Container();
        this.app.stage.addChild(this.mainContainer);
        this.mapSprites = [];
    }

    createMapSprites(terrain: Square[][]) {
        this.mainContainer.removeChildren();
        this.mapSprites = [];
        let size = terrain.length;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let mapSprite = new MapSprite(terrain[y][x]);
                this.mapSprites.push(mapSprite);
            }
        }
        this.mapSprites.forEach((sprite) => {
            this.mainContainer.addChild(sprite);
        });
    }

    render() {
        this.app.renderer.render(this.app.stage);
    }
}
