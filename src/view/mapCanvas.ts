import * as PIXI from 'pixi.js';
import * as displayConstants from '../constant/displayConstants';
import { MapSprite } from './base/mapSprite';
import { RiverGraphic } from './base/riverGraphic';
import { Square } from '../map/square';
import { ReplTerminal } from './replTerminal';
import { SimDisplay } from './simDisplay';
import { locationToString } from '../sim/util/location';
import { DISPLAY_MODES, DisplayMode } from './mode/displayMode';


const APP_DIV_ID = "canvas";
const DEFAULT_DISPLAY_MODE = "DEFAULT";

// A logical aggregation of all canvas operations
export class MapCanvas {

    app: PIXI.Application;
    mainContainer: PIXI.Container;
    mapSprites: MapSprite[];
    riverGraphics: RiverGraphic[];
    simDisplay: SimDisplay;
    mode: string;

    constructor() {
        this.app = new PIXI.Application({
                width: displayConstants.DEFAULT_DISPLAY_WIDTH,
                height: displayConstants.DEFAULT_DISPLAY_HEIGHT
        });
        this.mode = DEFAULT_DISPLAY_MODE;
        this.mainContainer = new PIXI.Container();
        this.mainContainer.interactive = true;
        this.app.stage.addChild(this.mainContainer);
        this.mapSprites = [];
        this.simDisplay = new SimDisplay(this.app, this.mainContainer);
    }

    createMapSprites(terrain: Square[][]) {
        this.mainContainer.removeChildren();
        this.mapSprites = [];
        this.riverGraphics = [];
        let size = terrain.length;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let mapSprite = new MapSprite(terrain[y][x]);
                this.mapSprites.push(mapSprite);
                if (terrain[y][x].isRiver()) {
                    let river = new RiverGraphic(terrain[y][x]);
                    this.riverGraphics.push(river);
                }
            }
        }
        this.mapSprites.forEach((sprite) => {
            this.mainContainer.addChild(sprite);
        });
        this.riverGraphics.forEach((river) => {
            this.mainContainer.addChild(river);
        });
    }

    createTerrainHooks(replTerminal: ReplTerminal): void {
        this.mainContainer.on("mouseout", (event) => {
            replTerminal.writeCommand("");
        });
        this.mapSprites.forEach((sprite) => {
            sprite.addHooks(replTerminal, this);
        });
    }

    changeMode(mode: string) {
        if (this.mode == mode) {
            return;
        }
        DISPLAY_MODES[mode].changefunc(this);
        this.mode = mode;
    }

    maintainMode(): void {
        this.mapSprites.forEach((sprite) => {
            sprite.tint = sprite.getBaseColor();
        });
        DISPLAY_MODES[this.mode].maintainfunc(this);
    }
}
