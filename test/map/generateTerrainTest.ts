import generateTerrain, { testfuncs } from '../../src/map/generateTerrain';
import { Square, Terrain } from '../../src/map/square';
import { expect } from 'chai';
import * as mapConstants from '../../src/constant/mapConstants';

const SMALL_MAP = [
    [0.9, 0.9, 0.9],
    [0.9, 0.8, 0.6],
    [0.9, 0.7, 0.5]
]

const SMALL_PRECIP = [
    [5, 0.4, 0.2],
    [0.5, 0.1, 0.9],
    [0.1, 0.2, 0.3]
]

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

describe('map:generateTerrain', () => {
    it('Test genSquareMap', () => {
        let terrain: Square[][] = testfuncs.genSquareMap(SMALL_MAP, SMALL_PRECIP);
        expect(terrain[1][1].isRiver()).to.be.true;
        expect(terrain[1][2].isRiver()).to.be.false;
        expect(terrain[2][2].isRiver()).to.be.false;
        expect(terrain[2][2].isWater()).to.be.true;
        expect(terrain[2][0].terrain).to.equal(Terrain.MountainRock);
        expect(terrain[1][2].terrain).to.equal(Terrain.Forest);
        expect(terrain[0][0].terrain).to.equal(Terrain.MountainGrass);
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                expect(terrain[y][x].x).to.equal(x);
                expect(terrain[y][x].y).to.equal(y);
            }
        }
    });

    it('Test setCoast', () => {
        let terrain: Square[][] = testfuncs.genSquareMap(ALTITUDE, PRECIP);
        expect(terrain[0][0].isCoast).to.be.false;
        expect(terrain[0][1].isCoast).to.be.true;
        expect(terrain[1][1].isCoast).to.be.true;
        expect(terrain[1][0].isCoast).to.be.true;
        expect(terrain[2][1].isCoast).to.be.false;
        expect(terrain[2][2].isCoast).to.be.true;
    });

    it('test generateTerrain', () => {
        let terrain: Square[][] = generateTerrain(50);
        let rivers = [].concat(...terrain).filter(s => s.isRiver())
        // Validate river flows
        rivers.forEach(currRiver => {
            expect(currRiver.flowDirection).to.not.equal(9);
            expect(currRiver.flowDirection).to.not.equal(4);
            let direction = mapConstants.DIRECTIONS.get(currRiver.flowDirection);
            let xnew = currRiver.x + direction[0];
            let ynew = currRiver.y + direction[1];
            let downstream = terrain[ynew][xnew];
            if (downstream.isWater()) {
                expect(downstream.isRiver()).to.be.false;
            } else {
                expect(downstream.isRiver()).to.be.true;
            }
        });
    });
})
