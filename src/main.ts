import { Controller } from './controller';

export const controller = new Controller();
let canvasDiv = document.getElementById('canvas');
canvasDiv.appendChild(controller.mapCanvas.app.view);
