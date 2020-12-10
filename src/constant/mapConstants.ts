// MAP GENERATION CONSTANTS

export const ALTITUDE_SCALAR = 2000;
export const ALTITUDE_ADJUST = 0.25;

export const PRECIPITATION_SCALAR = 1500;
export const PRECIPITATION_ADJUST = 0;
export const RIVER_THRESHOLD = 5;
export const RIVER_PRECIP_EFFECT = 50;

export const MOUNTAIN_ALTITUDE = 800;

export const DESERT_BIOME_PRECIP_CUTOFF = 400;
export const GRASS_BIOME_PRECIP_CUTOFF = 650;
export const WOOD_BIOME_PRECIP_CUTOFF = 1000;
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

export const DIRECTIONS_DESCRIPTION: Map<number, string> = new Map();
DIRECTIONS_DESCRIPTION.set(0, "Northwest");
DIRECTIONS_DESCRIPTION.set(1, "West");
DIRECTIONS_DESCRIPTION.set(2, "Southwest");
DIRECTIONS_DESCRIPTION.set(3, "North");
DIRECTIONS_DESCRIPTION.set(4, "Nowhere");
DIRECTIONS_DESCRIPTION.set(5, "South");
DIRECTIONS_DESCRIPTION.set(6, "Northeast");
DIRECTIONS_DESCRIPTION.set(7, "East");
DIRECTIONS_DESCRIPTION.set(8, "Southeast");

export const RIVER_WIDTH: number[][] = [
    [5, 1],
    [10, 2],
    [20, 3]
]

export const SICK_PROBABILITY: Map<number, number> = new Map();
SICK_PROBABILITY.set(2, 0.05);
SICK_PROBABILITY.set(3, 0.2);
SICK_PROBABILITY.set(4, 0.15);
SICK_PROBABILITY.set(5, 0.05);
SICK_PROBABILITY.set(6, 0.1);
SICK_PROBABILITY.set(7, 0.08);

// END MAP GENERATION CONSTANTS
