import * as PIXI from 'pixi.js';
import * as displayConstants from '../../constant/displayConstants';
import * as util from './util';
import { Square, Terrain } from '../../map/square';
import { ReplTerminal } from '../replTerminal';

export class MapSprite extends PIXI.Sprite {

    // Link to the square it represents
    square: Square;
    clicked: boolean;

    constructor(square: Square) {
        super(PIXI.Texture.WHITE);
        this.square = square;
        this.height = displayConstants.DEFAULT_SQUARE_SIZE;
        this.width = displayConstants.DEFAULT_SQUARE_SIZE;
        this.x = displayConstants.DEFAULT_SQUARE_SIZE * square.x;
        this.y = displayConstants.DEFAULT_SQUARE_SIZE * square.y;
        this.tint = this.getColor();
        this.interactive = true;
    }

    private getColor(): number {
        let terrainColor = displayConstants.BASE_COLOR_MAP.get(this.square.terrain);
        return util.getColorFromRgb(terrainColor[0], terrainColor[1], terrainColor[2])
    }

    addHooks(replTerminal: ReplTerminal): void {
        this.on("mouseover", (event) => {
            this.tint = util.getAlphaBlend(
                displayConstants.HIGHLIGHT_COLOR,
                displayConstants.BASE_COLOR_MAP.get(this.square.terrain),
                displayConstants.HIGHLIGHT_ALPHA
            )
            replTerminal.writeCommand(`describe-square x=${this.square.x} y=${this.square.y}`);
        });
        this.on("mouseout", (event) => {
            this.tint = this.getColor();
        });
        this.on("click", (event) => {
            replTerminal.execute();
        });
    }
}
