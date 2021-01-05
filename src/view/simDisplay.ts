import { Household } from '../sim/people/household';
import { Simulation } from '../sim/sim';
import { FamilySprite } from './base/familySprite';
import { CitySprite } from './base/citySprite';
import { Location, locationToString } from '../sim/util/location';
import { getColorFromTrio } from './base/util';
import { ReplTerminal } from './replTerminal';
import * as PIXI from 'pixi.js';
import * as displayConstants from '../constant/displayConstants';


const RADIUS = displayConstants.FAMILY_RADIUS;
const LINE_COLOR = 0xedcc9f;

export class SimDisplay {

    sim: Simulation;
    familySprites: Map<string, FamilySprite>;
    citySprites: Map<string, CitySprite>;
    mapRegistry: Map<string, number>;
    mainContainer: PIXI.Container;
    roundTexture: PIXI.Texture;
    cityTexture: PIXI.Texture;

    constructor(app: PIXI.Application, mainContainer: PIXI.Container) {
        this.familySprites = new Map();
        this.citySprites = new Map();
        this.mapRegistry = new Map();
        this.mainContainer = mainContainer;
        this.roundTexture = this.getRoundTexture(app, displayConstants.FAMILY_DISPLAY_COLOR);
    }

    setSim(sim: Simulation): void {
        this.sim = sim;
    }

    getRoundTexture(app: PIXI.Application,
                    fillColor): PIXI.Texture {
        let graphics = new PIXI.Graphics;
        graphics.beginFill(getColorFromTrio(fillColor), 0.7);
        graphics.lineStyle(1, LINE_COLOR, 0.8);
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

        // add city sprites.
        this.sim.terrain.forEach(row => {
            row.forEach(square => {
                let locStr = locationToString({x: square.x, y: square.y})
                let pop = square.simInfo.people.length;
                if (this.citySprites.has(locStr)) {
                    let city = this.citySprites.get(locStr);
                    if (pop > 50) {
                        city.setScale();
                    } else {
                        this.citySprites.delete(locStr);
                        this.mainContainer.removeChild(city);
                    }
                } else {
                    if (pop > 50) {
                        let city = new CitySprite(square)
                        city.addHooks(replTerminal);
                        this.citySprites.set(locStr, city);
                        this.mainContainer.addChild(city);
                    }
                }
            });
        });
    }
}
