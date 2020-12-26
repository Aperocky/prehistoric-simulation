import * as PIXI from 'pixi.js';
import * as displayConstants from '../constant/displayConstants';
import { MapSprite } from './base/mapSprite';
import { RiverGraphic } from './base/riverGraphic';
import { Square } from '../map/square';
import { getHealth } from '../map/simSquare';
import { ReplTerminal } from './replTerminal';
import { SimDisplay } from './simDisplay';
import { locationToString } from '../sim/util/location';
import { DisplayMode } from '../constant/displayConstants';


const APP_DIV_ID = "canvas";

// A logical aggregation of all canvas operations
export class MapCanvas {

    app: PIXI.Application;
    mainContainer: PIXI.Container;
    mapSprites: MapSprite[];
    riverGraphics: RiverGraphic[];
    simDisplay: SimDisplay;
    mode: DisplayMode;
    modeMap: { [funcName: string]: Function };

    constructor() {
        this.app = new PIXI.Application({
                width: displayConstants.DEFAULT_DISPLAY_WIDTH,
                height: displayConstants.DEFAULT_DISPLAY_HEIGHT
        });
        this.mode = DisplayMode.Default;
        this.mainContainer = new PIXI.Container();
        this.mainContainer.interactive = true;
        this.app.stage.addChild(this.mainContainer);
        this.mapSprites = [];
        this.simDisplay = new SimDisplay(this.app, this.mainContainer);
        this.modeMap = {
            "DEFAULT": this.changeModeToDefault,
            "DENSITY": this.changeModeToPopulationDensity,
            "HEALTH": this.changeModeToHealth
        }
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

    changeMode(mode: DisplayMode) {
        if (this.mode == mode) {
            return;
        }
        this.modeMap[mode].bind(this)();
        this.mode = mode;
    }

    maintainMode(): void {
        if (this.mode == DisplayMode.PopulationDensity) {
            this.changeModeToPopulationDensity();
        }
        if (this.mode == DisplayMode.Health) {
            this.changeModeToHealth();
        }
    }

    changeModeToDefault() {
        this.simDisplay.changeModeToDefault();
        this.mapSprites.forEach(sprite => {
            sprite.tint = sprite.getBaseColor();
        });
    }

    changeModeToPopulationDensity() {
        this.simDisplay.changeModeToPopulationDensity();
        this.mapSprites.forEach(sprite => {
            let square = sprite.square;
            let population = square.simInfo.people.length;
            sprite.tint = sprite.getPopulationDensityColor(population);
        });
    }

    changeModeToHealth() {
        this.simDisplay.changeModeToHealth();
        this.mapSprites.forEach(sprite => {
            let square = sprite.square;
            sprite.tint = sprite.getHealthColor(getHealth(square.simInfo));
        });
    }
}
