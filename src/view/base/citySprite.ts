import * as PIXI from 'pixi.js';
import * as displayConstants from '../../constant/displayConstants';
import { Square } from '../../map/square';
import { ReplTerminal } from '../replTerminal';
import { Location, locationToString } from '../../sim/util/location';
import { getColorFromTrio } from './util';


export class CitySprite extends PIXI.Sprite {

    // Link to the square it represents
    square: Square;

    constructor(square: Square) {
        super(PIXI.Texture.WHITE);
        this.square = square;
        this.anchor.set(0.5);
        this.zIndex = 100;
        this.interactive = true;
        this.alpha = 0.8;
        this.visible = false; // default non-visible
        this.tint = getColorFromTrio(displayConstants.CITY_DISPLAY_COLOR);
        this.x = displayConstants.DEFAULT_SQUARE_SIZE * square.x + 8;
        this.y = displayConstants.DEFAULT_SQUARE_SIZE * square.y + 8;
        this.setScale();
    }

    setScale(): number {
        let pop = this.square.simInfo.people.length;
        let scale = pop < 100
                ? 0.3
                : pop < 250
                ? 0.4
                : pop < 500
                ? 0.5
                : pop < 1000
                ? 0.6
                : 0.7;
        this.scale.set(scale)
        return scale;
    }

    addHooks(replTerminal: ReplTerminal): void {
        this.on("mouseover", (event) => {
            this.tint = getColorFromTrio(displayConstants.CITY_HIGHLIGHT_COLOR);
            replTerminal.writeCommand(`square x=${this.square.x} y=${this.square.y} city`);
        });
        this.on("mouseout", (event) => {
            this.tint = getColorFromTrio(displayConstants.CITY_DISPLAY_COLOR);
        });
        this.on("click", (event) => {
            replTerminal.execute();
        });
    }
}
