// DISPLAY CONSTANTS GOES HERE.

export const DEFAULT_DISPLAY_HEIGHT = 800;
export const DEFAULT_DISPLAY_WIDTH = 800;
export const DEFAULT_SQUARE_SIZE = 16;
export const DEFAULT_MAP_SIZE = 50;

export const WATER_COLOR = [16, 165, 245];
export const DESERT_COLOR = [225, 190, 145];
export const GRASS_COLOR = [160, 230, 100];
export const WOOD_COLOR = [80, 160, 75];
export const FOREST_COLOR = [15, 120, 50];
export const MOUNTAIN_COLOR = [200, 200, 200];
export const MOUNTAIN_GREEN = [180, 240, 180];
export const MINE_COLOR = [170, 170, 180];

export const HIGHLIGHT_COLOR = [255, 255, 0];
export const HIGHLIGHT_ALPHA = 0.3;

export const POPULATION_DENSITY_COLOR = [255, 0, 0];
export const POPULATION_DENSITY_FACTOR = 0.06;
export const POPULATION_DENSITY_ALPHA_MAX = 0.75; // ~550 person would have max alpha

export const HEALTH_ALPHA = 0.5;
export const HEALTH_LOW = [255, 80, 0];
export const HEALTH_HIGH = [0, 255, 0];

export const FAMILY_DISPLAY_COLOR = [255, 255, 255];
export const FAMILY_RADIUS = 8;

export type ColorScale = {
    baseColor: number[];
    topColor: number[];
    steps: number;
}

export const BASE_COLOR_MAP: Map<number, number[]> = new Map();
BASE_COLOR_MAP.set(1, WATER_COLOR);
BASE_COLOR_MAP.set(2, GRASS_COLOR);
BASE_COLOR_MAP.set(3, FOREST_COLOR);
BASE_COLOR_MAP.set(4, MOUNTAIN_COLOR);
BASE_COLOR_MAP.set(5, DESERT_COLOR);
BASE_COLOR_MAP.set(6, MOUNTAIN_GREEN);
BASE_COLOR_MAP.set(7, WOOD_COLOR);
