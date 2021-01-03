import { DisplayMode } from '../displayMode';
import { MapCanvas } from '../../mapCanvas';
import { SimDisplay } from '../../simDisplay';
import { MapSprite } from '../../base/mapSprite';
import { defaultMouseoverHook, defaultMouseoutHook } from '../displayMode';


function maintainfunc(canvas: MapCanvas) {
    return;
}


function changefunc(canvas: MapCanvas) {
    displayfunc(canvas.simDisplay);
    canvas.mapSprites.forEach(sprite => {
        sprite.tint = sprite.getBaseColor();
    });
}


function displayfunc(simDisplay: SimDisplay) {
    simDisplay.familySprites.forEach(fam => {
        fam.visible = true;
    });
}


const spritehook = {
    mouseover: defaultMouseoverHook,
    mouseout: defaultMouseoutHook,
}


export const DefaultDisplay: DisplayMode = {
    name: "DEFAULT",
    changefunc: changefunc,
    displayfunc: displayfunc,
    maintainfunc: maintainfunc,
    spritehook: spritehook,
}
