import { MapCanvas } from '../mapCanvas';
import { SimDisplay } from '../simDisplay';
import { MapSprite } from '../base/mapSprite';


export type DisplayMode = {
    name: string;
    changefunc: (canvas: MapCanvas) => void;
    displayfunc: (simDisplay: SimDisplay) => void;
    maintainfunc: (canvas: MapCanvas) => void;
    spritehook: {
        mouseover: (sprite: MapSprite) => void;
        mouseout: (sprite: MapSprite) => void;
    }
}


export const defaultMouseoverHook = (sprite: MapSprite) => {
    sprite.tint = sprite.getHighlightColor();
}


export const defaultMouseoutHook = (sprite: MapSprite) => {
    sprite.tint = sprite.getBaseColor();
}


import { DefaultDisplay } from './displayModes/default';
import { DensityDisplay } from './displayModes/density';
import { HealthDisplay } from './displayModes/health';
import { AgeDisplay } from './displayModes/age';


export enum DisplayModeName {
    Default = "DEFAULT",
    Density = "DENSITY",
    Health = "HEALTH",
    Age = "AGE",
}


export const DISPLAY_MODES: { [mode: string]: DisplayMode } = {
    "DEFAULT": DefaultDisplay,
    "DENSITY": DensityDisplay,
    "HEALTH": HealthDisplay,
    "AGE": AgeDisplay,
}
