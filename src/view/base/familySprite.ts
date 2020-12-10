import * as PIXI from 'pixi.js';
import * as displayConstants from '../../constant/displayConstants';
import * as util from './util';
import { Household } from '../../sim/people/household';
import { Location } from '../../sim/util/location';

const RADIUS = displayConstants.FAMILY_RADIUS;
const COLOR = displayConstants.FAMILY_DISPLAY_COLOR
const roundTexture: PIXI.Texture = (() => {
    let graphics = new PIXI.Graphics;
    graphics.beginFill(util.getColorFromRgb(COLOR[0], COLOR[1], COLOR[2]), 0.8);
    graphics.lineStyle(1, 0xedcc9f, 0.8);
    graphics.drawCircle(RADIUS, RADIUS, RADIUS);
    graphics.endFill();
    return PIXI.RenderTexture.create({width: graphics.width, height: graphics.height});
})();


export class FamilySprite extends PIXI.Sprite {

    household: Household;

    constructor(household: Household) {
        super(PIXI.Texture.WHITE);
        this.anchor.set(0.5);
        this.zIndex = 100;
        this.interactive = true;
        this.household = household;
        this.scale.set(0.5);
        this.x = displayConstants.DEFAULT_SQUARE_SIZE * household.location.x + RADIUS;
        this.y = displayConstants.DEFAULT_SQUARE_SIZE * household.location.y + RADIUS;
    }

    updateLocation(): void {
        this.x = displayConstants.DEFAULT_SQUARE_SIZE * this.household.location.x + RADIUS;
        this.y = displayConstants.DEFAULT_SQUARE_SIZE * this.household.location.y + RADIUS;
    }
}
