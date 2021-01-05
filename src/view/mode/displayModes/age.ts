import { DisplayMode } from '../displayMode';
import { MapCanvas } from '../../mapCanvas';
import { SimDisplay } from '../../simDisplay';
import * as displayConstants from '../../../constant/displayConstants';
import { MapSprite } from '../../base/mapSprite';
import { defaultMouseoverHook, defaultMouseoutHook } from '../displayMode';
import { getAlphaBlend, colorScale } from '../../base/util';


function getAgeColor(sprite: MapSprite): number {
    let people = sprite.square.simInfo.people;
    if (people.length) {
        let age = people.reduce((sum, p) => sum + p.age, 0)/people.length;
        let ageColor = colorScale(
            displayConstants.AGE_LOW,
            displayConstants.AGE_HIGH,
            age/80);
        return getAlphaBlend(
            ageColor,
            sprite.getBaseColorTrio(),
            displayConstants.AGE_ALPHA);
    } else {
        return sprite.getBaseColor();
    }
}


function maintainfunc(canvas: MapCanvas) {
    changefunc(canvas);
}


function changefunc(canvas: MapCanvas) {
    displayfunc(canvas.simDisplay);
    canvas.mapSprites.forEach(sprite => {
        sprite.tint = getAgeColor(sprite);
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
        sprite.tint = getAgeColor(sprite);
    }
}


export const AgeDisplay: DisplayMode = {
    name: "AGE",
    changefunc: changefunc,
    displayfunc: displayfunc,
    maintainfunc: maintainfunc,
    spritehook: spritehook,
}
