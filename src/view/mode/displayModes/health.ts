import { DisplayMode } from '../displayMode';
import { MapCanvas } from '../../mapCanvas';
import { SimDisplay } from '../../simDisplay';
import { getHealth } from '../../../map/simSquare';
import * as displayConstants from '../../../constant/displayConstants';
import { MapSprite } from '../../base/mapSprite';
import { defaultMouseoverHook, defaultMouseoutHook } from '../displayMode';
import { getAlphaBlend, colorScale } from '../../base/util';


function getHealthColor(sprite: MapSprite): number {
    let health = getHealth(sprite.square.simInfo);
    if (health == 0) {
        return sprite.getBaseColor();
    }
    let healthColor = colorScale(
        displayConstants.HEALTH_LOW,
        displayConstants.HEALTH_HIGH,
        health/100);
    return getAlphaBlend(
        healthColor,
        sprite.getBaseColorTrio(),
        displayConstants.HEALTH_ALPHA);
}


function maintainfunc(canvas: MapCanvas) {
    changefunc(canvas);
}


function changefunc(canvas: MapCanvas) {
    displayfunc(canvas.simDisplay);
    canvas.mapSprites.forEach(sprite => {
        sprite.tint = getHealthColor(sprite);
    });
}


function displayfunc(simDisplay: SimDisplay) {
    simDisplay.familySprites.forEach(fam => {
        fam.visible = false;
    });
    simDisplay.citySprites.forEach(city => {
        city.visible = false;
    });
}


const spritehook = {
    mouseover: defaultMouseoverHook,
    mouseout: (sprite: MapSprite) => {
        sprite.tint = getHealthColor(sprite);
    }
}


export const HealthDisplay: DisplayMode = {
    name: "HEALTH",
    changefunc: changefunc,
    displayfunc: displayfunc,
    maintainfunc: maintainfunc,
    spritehook: spritehook,
}
