import { Household } from '../sim/people/household';
import { Simulation } from '../sim/sim';
import { FamilySprite } from './base/familySprite';
import * as PIXI from 'pixi.js';


export enum Mode {
    Default = "DEFAULT"
}

export class SimDisplay {
    
    mode: Mode;
    sim: Simulation;
    familySprites: Map<string, FamilySprite>;
    mainContainer: PIXI.Container;

    constructor(mainContainer: PIXI.Container) {
        this.mode = Mode.Default;
        this.familySprites = new Map();
        this.mainContainer = mainContainer;
    }

    setSim(sim: Simulation): void {
        this.sim = sim;
    }

    syncSim(): void {
        console.log(this.sim.households.size);
        this.familySprites.forEach((fam, key) => {
            if (this.sim.households.has(key)) {
                fam.updateLocation();
            } else {
                this.familySprites.delete(key);
                this.mainContainer.removeChild(fam);
            }
        });
        this.sim.households.forEach((hh, key) => {
            if (!(this.familySprites.has(key))) {
                let familySprite = new FamilySprite(hh);
                this.mainContainer.addChild(familySprite);
                this.familySprites.set(hh.id, familySprite);
            }
        });
    }
}
