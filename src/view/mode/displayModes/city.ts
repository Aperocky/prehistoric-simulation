import { DisplayMode } from '../displayMode';
import { MapCanvas } from '../../mapCanvas';
import { SimDisplay } from '../../simDisplay';
import { defaultMouseoverHook, defaultMouseoutHook } from '../displayMode';


function maintainfunc(canvas: MapCanvas) {
    changefunc(canvas);
}


function changefunc(canvas: MapCanvas) {
    displayfunc(canvas.simDisplay);
    canvas.mapSprites.forEach(sprite => {
        sprite.tint = sprite.getBaseColor();
    });
}


function displayfunc(simDisplay: SimDisplay) {
    simDisplay.familySprites.forEach(fam => {
        fam.visible = false;
    });
    simDisplay.citySprites.forEach(city => {
        city.visible = true;
    });
}


const spritehook = {
    mouseover: defaultMouseoverHook,
    mouseout: defaultMouseoutHook,
}


export const CityDisplay: DisplayMode = {
    name: "CITY",
    changefunc: changefunc,
    displayfunc: displayfunc,
    maintainfunc: maintainfunc,
    spritehook: spritehook,
}
