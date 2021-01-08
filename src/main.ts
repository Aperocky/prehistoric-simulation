import { Controller } from './controller';

export const controller = new Controller();
let canvasDiv = document.getElementById('canvas');

let mql = window.matchMedia('(max-width: 900px)');
if (mql.matches) {
    canvasDiv.style.display = "none";
    controller.replTerminal.identifyMobile();
} else {
    canvasDiv.appendChild(controller.mapCanvas.app.view);
}
