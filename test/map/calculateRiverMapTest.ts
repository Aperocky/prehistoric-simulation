import { testfuncs } from '../../src/map/calculateRiverMap'
import { expect, assert } from 'chai'

const DUMMY_SMALL_MATRIX = [
    [0.1, 0.2],
    [0.3, 0.4]
];

const DUMMY_SMALL_MATRIX_DIRECTIONS = [
    [4, 1],
    [3, 0]
];

const IMPLODING_MATRIX = [
    [0.1, 0.2, 0.3],
    [0.4, 0, 0.5],
    [0.6, 0.7, 0.8]
];

const IMPLODING_MATRIX_DIRECTIONS = [
    [8, 5, 2],
    [7, 4, 1],
    [6, 3, 0]
];

describe('calculateRiverMap subFuncs', () => {
    it('test getArr', () => {
        expect(testfuncs.getArr(0, 10)).to.deep.equal([0,1]);
        expect(testfuncs.getArr(9, 10)).to.deep.equal([8,9]);
        expect(() => testfuncs.getArr(10, 10)).to.throw(RangeError);
    });

    it('test getDirection', () => {
        expect(testfuncs.getDirection(0,0,DUMMY_SMALL_MATRIX)).to.equal(4);
        expect(testfuncs.getDirection(1,0,DUMMY_SMALL_MATRIX)).to.equal(1);
        expect(testfuncs.getDirection(1,1,DUMMY_SMALL_MATRIX)).to.equal(0);
        expect(testfuncs.getDirection(0,1,DUMMY_SMALL_MATRIX)).to.equal(3);
    });

    it('test getDirectionMap', () => {
        expect(testfuncs.getDirectionMap(DUMMY_SMALL_MATRIX))
                .to.deep.equal(DUMMY_SMALL_MATRIX_DIRECTIONS);
        expect(testfuncs.getDirectionMap(IMPLODING_MATRIX))
                .to.deep.equal(IMPLODING_MATRIX_DIRECTIONS);
    });
})
