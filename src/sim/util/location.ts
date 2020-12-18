import { Square, Terrain } from '../../map/square';


export type Location = {
    x: number;
    y: number;
}


export function locationToString(loc: Location): string {
    return JSON.stringify(loc);
}


export function stringToLocation(locstr: string): Location {
    return JSON.parse(locstr);
}


export function getRandomLandLocations(terrain: Square[][], count: number): Location[] {
    let availableLocations: Location[] = [].concat(...terrain)
            .filter(sq => !sq.isWater())
            .map(sq => { return { x: sq.x, y: sq.y }});
    return [...Array(count)]
            .map(x => availableLocations[Math.floor(Math.random()*availableLocations.length)]);
}


export function getTerrainFromLocation(terrain: Square[][], location: Location): Terrain {
    return terrain[location.y][location.x].terrain;
}


export function randomWalk(loc: Location, terrain: Square[][], steps: number, mode: boolean = false): Location {
    let currloc = loc;
    for (let i = 0; i < steps; i++) {
        let adjacents = getAdjacentLocations(currloc).filter(l => isLegitLocation(l, terrain, mode));
        if (adjacents.length) {
            currloc = adjacents[Math.floor(Math.random()*adjacents.length)];
        } else {
            return currloc;
        }
    }
    return currloc;
}


function isInMap(loc: Location, size: number): boolean {
    return loc.x >= 0 && loc.y >= 0 && loc.x < size && loc.y < size;
}


function isLegitLocation(loc: Location, terrain: Square[][], mode: boolean = false): boolean {
    // mode -> false: land, true: water
    if (isInMap(loc, terrain.length)) {
        return mode == terrain[loc.y][loc.x].isWater();
    }
    return false;
}


function getAdjacentLocations(loc: Location): Location[] {
    return [
        { x: loc.x + 1, y: loc.y },
        { x: loc.x, y: loc.y + 1 },
        { x: loc.x - 1, y: loc.y },
        { x: loc.x, y: loc.y - 1 }
    ]
}


export const testfuncs = {
    isInMap: isInMap,
    isLegitLocation: isLegitLocation,
    getAdjacentLocations: getAdjacentLocations
}
