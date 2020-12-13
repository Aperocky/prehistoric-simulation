import * as PIXI from 'pixi.js';
import * as displayConstants from '../../constant/displayConstants';
import * as util from './util';
import { Square, Terrain } from '../../map/square';
import { ReplTerminal } from '../replTerminal';
import { MapCanvas } from '../mapCanvas';
import { DisplayMode } from '../../constant/displayConstants';

export class MapSprite extends PIXI.Sprite {

    // Link to the square it represents
    square: Square;
    clicked: boolean;

    // Temporal, stored only in population mode
    population: number;

    constructor(square: Square) {
        super(PIXI.Texture.WHITE);
        this.square = square;
        this.height = displayConstants.DEFAULT_SQUARE_SIZE;
        this.width = displayConstants.DEFAULT_SQUARE_SIZE;
        this.x = displayConstants.DEFAULT_SQUARE_SIZE * square.x;
        this.y = displayConstants.DEFAULT_SQUARE_SIZE * square.y;
        this.tint = this.getBaseColor();
        this.interactive = true;
    }

    getBaseColor(): number {
        let terrainColor = displayConstants.BASE_COLOR_MAP.get(this.square.terrain);
        return util.getColorFromRgb(terrainColor[0], terrainColor[1], terrainColor[2])
    }

    getHighlightColor(): number {
        return util.getAlphaBlend(
            displayConstants.HIGHLIGHT_COLOR,
            displayConstants.BASE_COLOR_MAP.get(this.square.terrain),
            displayConstants.HIGHLIGHT_ALPHA
        )
    }

    getPopulationDensityColor(population?: number): number {
        if (population === undefined) {
            if (this.population === undefined) {
                throw new Error("pop status not prefilled");
            }
            population = this.population;
        } else {
            this.population = population;
        }
        if (population == 0) {
            return this.getBaseColor();
        }
        let populationAlpha = displayConstants.POPULATION_DENSITY_FACTOR * population;
        populationAlpha = populationAlpha > displayConstants.POPULATION_DENSITY_ALPHA_MAX
                ? displayConstants.POPULATION_DENSITY_ALPHA_MAX
                : populationAlpha;
        return util.getAlphaBlend(
            displayConstants.POPULATION_DENSITY_COLOR,
            displayConstants.BASE_COLOR_MAP.get(this.square.terrain),
            populationAlpha);
    }

    addHooks(replTerminal: ReplTerminal, mapCanvas: MapCanvas): void {
        this.on("mouseover", (event) => {
            switch (mapCanvas.mode) {
                case DisplayMode.Default:
                case DisplayMode.PopulationDensity:
                default:
                    this.tint = this.getHighlightColor();
            }
            replTerminal.writeCommand(`describe-square x=${this.square.x} y=${this.square.y}`);
        });
        this.on("mouseout", (event) => {
            switch (mapCanvas.mode) {
                case DisplayMode.PopulationDensity:
                    this.tint = this.getPopulationDensityColor();
                    break;
                case DisplayMode.Default:
                default:
                    this.tint = this.getBaseColor();
            }
        });
        this.on("click", (event) => {
            replTerminal.execute();
        });
    }
}
