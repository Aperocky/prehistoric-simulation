// MAP GENERATION CONSTANTS

export const ALTITUDE_SCALAR = 2000;
export const ALTITUDE_ADJUST = 0.25;

export const PRECIPITATION_SCALAR = 1500;
export const PRECIPITATION_ADJUST = 0;
export const RIVER_THRESHOLD = 5;
export const RIVER_PRECIP_EFFECT = 50;

export const MOUNTAIN_ALTITUDE = 800;

export const DESERT_BIOME_PRECIP_CUTOFF = 400;
export const GRASS_BIOME_PRECIP_CUTOFF = 900;
export const MOUNTAIN_BIOME_PRECIP_CUTOFF = 600;

const DIRECTIONS_LEGEND = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
];

export const DIRECTIONS: Map<number, number[]> = new Map();
DIRECTIONS.set(0, [-1, -1]);
DIRECTIONS.set(1, [-1, 0]);
DIRECTIONS.set(2, [-1, 1]);
DIRECTIONS.set(3, [0, -1]);
DIRECTIONS.set(4, [0, 0]);
DIRECTIONS.set(5, [0, 1]);
DIRECTIONS.set(6, [1, -1]);
DIRECTIONS.set(7, [1, 0]);
DIRECTIONS.set(8, [1, 1]);

export const RIVER_WIDTH: number[][] = [
    [5, 1],
    [10, 2],
    [20, 3]
]
// END MAP GENERATION CONSTANTS
