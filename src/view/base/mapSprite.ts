import * as PIXI from 'pixi.js';
import * as displayConstants from '../../constant/displayConstants';
import * as util from './util';
import { Square, Terrain } from '../../map/square';
import { getHealth } from '../../map/simSquare';
import { ReplTerminal } from '../replTerminal';
import { MapCanvas } from '../mapCanvas';
import { DisplayModeName, DISPLAY_MODES } from '../mode/displayMode';


export class MapSprite extends PIXI.Sprite {

    // Link to the square it represents
    square: Square;

    constructor(square: Square) {
        super(PIXI.Texture.WHITE);
        this.square = square;
        this.height = displayConstants.DEFAULT_SQUARE_SIZE;
        this.width = displayConstants.DEFAULT_SQUARE_SIZE;
        this.x = displayConstants.DEFAULT_SQUARE_SIZE * square.x;
        this.y = displayConstants.DEFAULT_SQUARE_SIZE * square.y;
        this.tint = this.getBaseColor();
        this.interactive = true;
    }

    getBaseColorTrio(): number[] {
        let terrainColor = displayConstants.BASE_COLOR_MAP.get(this.square.terrain);
        if (this.square.isMine) {
            terrainColor = displayConstants.MINE_COLOR;
        }
        return terrainColor;
    }

    getBaseColor(): number {
        let terrainColor = this.getBaseColorTrio();
        return util.getColorFromTrio(terrainColor)
    }

    getHighlightColor(): number {
        return util.getAlphaBlend(
            displayConstants.HIGHLIGHT_COLOR,
            this.getBaseColorTrio(),
            displayConstants.HIGHLIGHT_ALPHA
        )
    }

    addHooks(replTerminal: ReplTerminal, mapCanvas: MapCanvas): void {
        this.on("mouseover", (event) => {
            DISPLAY_MODES[mapCanvas.mode].spritehook.mouseover(this)
            replTerminal.writeCommand(`describe-square x=${this.square.x} y=${this.square.y}`);
        });
        this.on("mouseout", (event) => {
            DISPLAY_MODES[mapCanvas.mode].spritehook.mouseout(this)
        });
        this.on("click", (event) => {
            replTerminal.execute();
        });
    }
}
