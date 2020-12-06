import { Location, testfuncs, randomWalk,
        locationToString, getRandomLandLocations } from '../../../src/sim/util/location';
import { testfuncs as terrain } from '../../../src/map/generateTerrain';
import { expect } from 'chai';


const ALTITUDE = [
    [0.9, 0.9, 0.1],
    [0.9, 0.8, 0.2],
    [0.1, 0.2, 0.3]
]

const PRECIP = [
    [0.8, 0.4, 0.2],
    [0.5, 0.1, 0.9],
    [0.1, 0.2, 0.3]
]

export const TEST_TERRAIN = terrain.genSquareMap(ALTITUDE, PRECIP);

describe('location', () => {
    it('test getAdjacentLocations', () => {
        let location: Location = { x: 1, y: 0};
        let adjacents = testfuncs.getAdjacentLocations(location);
        expect(adjacents.length).to.equal(4);
    });
    
    it('test isInMap', () => {
        let outofbounds = { x: 2, y: 3 };
        let inbound = { x: 2, y: 2 };
        expect(testfuncs.isInMap(outofbounds, TEST_TERRAIN.length)).to.be.false;
        expect(testfuncs.isInMap(inbound, TEST_TERRAIN.length)).to.be.true;
    });

    it('test isLegitLocation', () => {
        let land = { x: 1, y: 1 };
        let water = { x: 2, y: 1 };
        let outofbounds = { x: 2, y: 3 };
        expect(testfuncs.isLegitLocation(land, TEST_TERRAIN, false)).to.be.true;
        expect(testfuncs.isLegitLocation(land, TEST_TERRAIN, true)).to.be.false;
        expect(testfuncs.isLegitLocation(water, TEST_TERRAIN, false)).to.be.false;
        expect(testfuncs.isLegitLocation(water, TEST_TERRAIN, true)).to.be.true;
        expect(testfuncs.isLegitLocation(outofbounds, TEST_TERRAIN, false)).to.be.false;
        expect(testfuncs.isLegitLocation(outofbounds, TEST_TERRAIN, true)).to.be.false;
    });

    it('test Randomwalk', () => {
        let location = { x: 1, y: 1 };
        let destination = randomWalk(location, TEST_TERRAIN, 1);
        expect([{x:1, y:0}, {x:0, y:1}].map(loc => locationToString(loc))).to
                .contain(locationToString(destination));
        destination = randomWalk(location, TEST_TERRAIN, 4);
        expect(destination.x < 2).to.be.true;
        expect(destination.y < 2).to.be.true;
    });

    it('test randomwalk in blocked square', () => {
        let blockedLocation = { x: 2, y: 2 };
        let destination = randomWalk(blockedLocation, TEST_TERRAIN, 3);
        expect(destination).to.deep.equal(blockedLocation);
    });

    it('test randomwalk on water', () => {
        let location = { x: 1, y: 1 };
        let destination = randomWalk(location, TEST_TERRAIN, 1, true);
        expect([{x:1, y:2}, {x:2, y:1}].map(loc => locationToString(loc))).to
                .contain(locationToString(destination));
        destination = randomWalk(location, TEST_TERRAIN, 5, true);
        expect(TEST_TERRAIN[destination.y][destination.x].isWater()).to.be.true;
    });

    it('test getRandomLandLocations', () => {
        let randos = getRandomLandLocations(TEST_TERRAIN, 4);
        expect(randos.length).to.equal(4);
        expect(TEST_TERRAIN[randos[0].y][randos[0].x].isWater()).to.be.false;
    });
});
