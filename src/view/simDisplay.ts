import { Household } from '../sim/people/household';
import { Simulation } from '../sim/sim';
import { FamilySprite } from './base/familySprite';
import { Location } from '../sim/util/location';
import { getColorFromRgb } from './base/util';
import { ReplTerminal } from './replTerminal';
import * as PIXI from 'pixi.js';
import * as displayConstants from '../constant/displayConstants';


const RADIUS = displayConstants.FAMILY_RADIUS;
const COLOR = displayConstants.FAMILY_DISPLAY_COLOR


export class SimDisplay {

    sim: Simulation;
    familySprites: Map<string, FamilySprite>;
    mapRegistry: Map<string, number>;
    mainContainer: PIXI.Container;
    roundTexture: PIXI.Texture;

    constructor(app: PIXI.Application, mainContainer: PIXI.Container) {
        this.familySprites = new Map();
        this.mapRegistry = new Map();
        this.mainContainer = mainContainer;
        this.roundTexture = this.getRoundTexture(app);
    }

    setSim(sim: Simulation): void {
        this.sim = sim;
    }

    getRoundTexture(app: PIXI.Application): PIXI.Texture {
        let graphics = new PIXI.Graphics;
        graphics.beginFill(getColorFromRgb(COLOR[0], COLOR[1], COLOR[2]), 0.8);
        graphics.lineStyle(1, 0xedcc9f, 0.8);
        graphics.drawCircle(RADIUS, RADIUS, RADIUS);
        graphics.endFill();
        return app.renderer.generateTexture(graphics, PIXI.SCALE_MODES.LINEAR, 1);
    }

    syncSim(replTerminal: ReplTerminal): void {
        // clear mapRegistry
        this.mapRegistry = new Map();
        this.familySprites.forEach((fam, key) => {
            if (this.sim.households.has(key)) {
                fam.updateLocation(this.mapRegistry);
            } else {
                this.familySprites.delete(key);
                this.mainContainer.removeChild(fam);
            }
        });
        this.sim.households.forEach((hh, key) => {
            if (!(this.familySprites.has(key))) {
                let familySprite = new FamilySprite(hh, this.mapRegistry, this.roundTexture);
                familySprite.addHooks(replTerminal);
                this.mainContainer.addChild(familySprite);
                this.familySprites.set(hh.id, familySprite);
            }
        });
    }

    changeModeToDefault() {
        this.familySprites.forEach(fam => {
            fam.visible = true;
        });
    }

    changeModeToPopulationDensity() {
        this.familySprites.forEach(fam => {
            fam.visible = false;
        });
    }
}
