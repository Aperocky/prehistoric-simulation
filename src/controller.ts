import { Square } from './map/square';
import generateTerrain from './map/generateTerrain';
import * as mapConstants from './constant/displayConstants';
import { MapCanvas } from './view/mapCanvas';
import { ReplTerminal } from './view/replTerminal';
import { Simulation } from './sim/sim';
import initializeSim from './sim/util/initializeSim';


// Logical aggregation of everything.
export class Controller {

    terrain: Square[][];
    mapCanvas: MapCanvas;
    replTerminal: ReplTerminal;
    simulation: Simulation;

    constructor() {
        this.mapCanvas = new MapCanvas();
        this.replTerminal = new ReplTerminal(this);
        this.generateTerrain()
    }

    generateTerrain() {
        this.terrain = generateTerrain(mapConstants.DEFAULT_MAP_SIZE);
        this.mapCanvas.createMapSprites(this.terrain);
        this.mapCanvas.createTerrainHooks(this.replTerminal);
        this.simulation = new Simulation(this.terrain);
        initializeSim(this.simulation, 50);
        this.mapCanvas.simDisplay.setSim(this.simulation);
        this.mapCanvas.simDisplay.syncSim(this.replTerminal);
    }

    runTurn() {
        this.simulation.runTurn();
        this.mapCanvas.simDisplay.syncSim(this.replTerminal);
        this.mapCanvas.app.renderer.render(this.mapCanvas.mainContainer);
    }
}
