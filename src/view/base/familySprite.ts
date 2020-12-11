import * as PIXI from 'pixi.js';
import * as displayConstants from '../../constant/displayConstants';
import { Household } from '../../sim/people/household';
import { ReplTerminal } from '../replTerminal';
import { Location, locationToString } from '../../sim/util/location';


export class FamilySprite extends PIXI.Sprite {

    household: Household;

    constructor(household: Household, mapRegistry: Map<string, number>, texture: PIXI.Texture) {
        super(texture);
        this.anchor.set(0.5);
        this.zIndex = 100;
        this.interactive = true;
        this.household = household;
        this.scale.set(0.4);
        this.alpha = 0.7;
        let adjust = this.getAdjustFromMapRegistry(mapRegistry);
        if (adjust != null) {
            this.x = displayConstants.DEFAULT_SQUARE_SIZE * household.location.x + adjust[0];
            this.y = displayConstants.DEFAULT_SQUARE_SIZE * household.location.y + adjust[1];
        } else {
            this.visible = false;
        }
    }

    updateLocation(mapRegistry: Map<string, number>): void {
        let adjust = this.getAdjustFromMapRegistry(mapRegistry);
        if (adjust != null) {
            this.x = displayConstants.DEFAULT_SQUARE_SIZE * this.household.location.x + adjust[0];
            this.y = displayConstants.DEFAULT_SQUARE_SIZE * this.household.location.y + adjust[1];
            this.visible = true;
        } else {
            this.visible = false;
        }
    }

    getAdjustFromMapRegistry(mapRegistry: Map<string, number>): number[] | null {
        let rank = 0;
        let locstr = locationToString(this.household.location);
        if (mapRegistry.has(locstr)) {
            rank = mapRegistry.get(locstr);
            mapRegistry.set(locstr, rank + 1);
        } else {
            mapRegistry.set(locstr, 1);
        }
        if (rank < 4) {
            return [4 + rank % 2 * 8, 4 + Math.floor(rank/2) * 8];
        }
        return null;
    }

    addHooks(replTerminal: ReplTerminal): void {
        this.on("mouseover", (event) => {
            this.scale.set(0.8);
            replTerminal.writeCommand(`describe-household id=${this.household.id}`);
        });
        this.on("mouseout", (event) => {
            this.scale.set(0.4);
        });
        this.on("click", (event) => {
            replTerminal.execute();
        });
    }
}
