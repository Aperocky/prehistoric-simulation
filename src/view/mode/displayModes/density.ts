import { DisplayMode } from '../displayMode';
import { MapCanvas } from '../../mapCanvas';
import { SimDisplay } from '../../simDisplay';
import { MapSprite } from '../../base/mapSprite';
import * as displayConstants from '../../../constant/displayConstants';
import { defaultMouseoverHook, defaultMouseoutHook } from '../displayMode';
import { getAlphaBlend } from '../../base/util';


function getPopulationDensityColor(sprite: MapSprite): number {
    let population = sprite.square.simInfo.people.length;
    if (population == 0) {
        return sprite.getBaseColor();
    }
    let populationAlpha = displayConstants.POPULATION_DENSITY_FACTOR * population**0.4;
    populationAlpha = populationAlpha > displayConstants.POPULATION_DENSITY_ALPHA_MAX
            ? displayConstants.POPULATION_DENSITY_ALPHA_MAX
            : populationAlpha;
    return getAlphaBlend(
        displayConstants.POPULATION_DENSITY_COLOR,
        sprite.getBaseColorTrio(),
        populationAlpha);
}


function maintainfunc(canvas: MapCanvas) {
    changefunc(canvas);
}


function changefunc(canvas: MapCanvas) {
    displayfunc(canvas.simDisplay);
    canvas.mapSprites.forEach(sprite => {
        sprite.tint = getPopulationDensityColor(sprite);
    });
}


function displayfunc(simDisplay: SimDisplay) {
    simDisplay.familySprites.forEach(fam => {
        fam.visible = false;
    });
}


const spritehook = {
    mouseover: defaultMouseoverHook,
    mouseout: (sprite: MapSprite) => {
        sprite.tint = getPopulationDensityColor(sprite);
    }
}


export const DensityDisplay: DisplayMode = {
    name: "DENSITY",
    changefunc: changefunc,
    displayfunc: displayfunc,
    maintainfunc: maintainfunc,
    spritehook: spritehook,
}
