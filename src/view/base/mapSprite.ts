import * as PIXI from 'pixi.js';
import * as displayConstants from '../../constant/displayConstants';
import { Square, Terrain } from '../../map/square';

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
        this.tint = this.getColor();
        this.interactive = true;
    }

    private getColor(): number {
        let terrainColor = displayConstants.BASE_COLOR_MAP.get(this.square.terrain);
        let r = terrainColor[0];
        let g = terrainColor[1];
        let b = terrainColor[2];
        return r*256*256 + g*256 + b;
    }
}
