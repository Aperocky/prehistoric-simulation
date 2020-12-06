import { expect } from 'chai';
import { Square, Terrain } from '../../src/map/square';
import * as mapConstants from '../../src/constant/mapConstants';

export const GRASS_SQUARE = new Square(0.5, 0.3, 5, 1, 1, 1);

describe('square', () => {
    it('Test Desert Square Generation', () => {
        let square = new Square(0.5, 0, 9, 1, 1, 1);
        expect(square.isRiver()).to.be.false;
        expect(square.isWater()).to.be.false;
        expect(square.terrain).to.equal(Terrain.Desert);
    });

    it('Test Ocean Square Generation', () => {
        let square = new Square(0.1, 0, 5, 1, 1, 1);
        expect(square.isRiver()).to.be.false;
        expect(square.isWater()).to.be.true;
        expect(square.terrain).to.equal(Terrain.Water);
    });

    it('Test River Square Generation', () => {
        let square = new Square(0.5, 0.1, 2, 9, 1, 1);
        expect(square.isRiver()).to.be.true;
        expect(square.isWater()).to.be.false;
        expect(square.terrain).to.equal(Terrain.Grass);
        expect(square.precip).to.be.closeTo(mapConstants.PRECIPITATION_SCALAR*0.1, 0.001);
    });

    it('Test Forest Square Generation', () => {
        let square = new Square(0.5, 0.9, 9, 1, 1, 1);
        expect(square.isRiver()).to.be.false;
        expect(square.isWater()).to.be.false;
        expect(square.terrain).to.equal(Terrain.Forest);
    });

    it('Test Lake Square Generation', () => {
        let square = new Square(0.5, 0.4, 4, 9, 1, 1);
        expect(square.isRiver()).to.be.false;
        expect(square.isWater()).to.be.true;
        expect(square.terrain).to.equal(Terrain.Water);
    });

    it('Test Mountain Square Generation Wet', () => {
        let square = new Square(0.9, 0.5, 2, 1, 1, 1);
        expect(square.isRiver()).to.be.false;
        expect(square.isWater()).to.be.false;
        expect(square.terrain).to.equal(Terrain.MountainGrass);
    });

    it('Test Mountain Square Generation Dry', () => {
        let square = new Square(0.9, 0.1, 2, 1, 1, 1);
        expect(square.isRiver()).to.be.false;
        expect(square.isWater()).to.be.false;
        expect(square.terrain).to.equal(Terrain.MountainRock);
    });
});
