import riverMap, { testfuncs } from '../../src/map/calculateRiverMap';
import * as constants from '../../src/constant/constants';
import simplexGenerator from '../../src/map/simplexGenerator'
import { expect, assert } from 'chai';

const DUMMY_SMALL_MATRIX = [
    [0.1, 0.2],
    [0.3, 0.4]
];

const DUMMY_SMALL_MATRIX_DIRECTIONS = [
    [4, 1],
    [3, 0]
];

const DUMMY_SMALL_MATRIX_SHORES = [
    [0, 1],
    [1, 1]
]

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

const LAND_MAP = [
    [0.8, 0.9, 0.95],
    [0.9, 0.9, 0.9],
    [0.95, 0.9, 0.7]
]

const LAND_MAP_DIRECTIONS = [
    [4, 1, 1],
    [3, 8, 5],
    [3, 7, 4]
]

const LAND_MAP_2_2_UPSTREAMS = [
    [1, 1],
    [2, 1],
    [1, 2]
]

const LAND_MAP_0_1_UPSTREAMS = [
    [0, 2]
]

const FLOW_VOLUME_MAP = [
    [0.8, 0.9, 0.8],
    [0.6, 0.4, 0.5],
    [0.5, 0.3, 0.1]
]

const FLOW_VOLUME_PRECIP = [
    [0.2, 0.3, 0.4],
    [10, 0.1, 0.0],
    [0, 0, 0]
]

const FLOW_VOLUME_RIVERMAP_CUTOFF_0_8 = [
    [9, 9, 9],
    [8, 8, 9],
    [9, 7, 9]
]

const FLOW_RECURSION_MAP = [
    [0.9, 0.9, 0.9],
    [0.9, 0.8, 0.6],
    [0.9, 0.7, 0.5]
]

const FLOW_RECURSION_PRECIP = [
    [0.2, 0.3, 0.1],
    [0.55, 0.1, 0.9],
    [0.1, 0.2, 0.3]
]

const FLOW_RECURSION_RIVERMAP_CUTOFF_1 = [
    [9, 9, 9],
    [9, 9, 5],
    [9, 9, 4]
]

const FLOW_RECURSION_RIVERMAP_CUTOFF_HALF = [
    [9, 9, 9],
    [8, 9, 5],
    [9, 7, 4]
]

describe('calculateRiverMap', () => {
    it('test getArr', () => {
        expect(testfuncs.getArr(0, 10)).to.deep.equal([0,1]);
        expect(testfuncs.getArr(9, 10)).to.deep.equal([8,9]);
        expect(() => testfuncs.getArr(10, 10)).to.throw(RangeError);
    });

    it('test getDirection', () => {
        expect(testfuncs.getDirection(0, 0, DUMMY_SMALL_MATRIX)).to.equal(4);
        expect(testfuncs.getDirection(1, 0, DUMMY_SMALL_MATRIX)).to.equal(1);
        expect(testfuncs.getDirection(1, 1, DUMMY_SMALL_MATRIX)).to.equal(0);
        expect(testfuncs.getDirection(0, 1, DUMMY_SMALL_MATRIX)).to.equal(3);
    });

    it('test getDirectionMap', () => {
        expect(testfuncs.getDirectionMap(DUMMY_SMALL_MATRIX))
                .to.deep.equal(DUMMY_SMALL_MATRIX_DIRECTIONS);
        expect(testfuncs.getDirectionMap(IMPLODING_MATRIX))
                .to.deep.equal(IMPLODING_MATRIX_DIRECTIONS);
        expect(testfuncs.getDirectionMap(LAND_MAP))
                .to.deep.equal(LAND_MAP_DIRECTIONS);
    });

    it('test getShoreAndBottomLocations', () => {
        expect(testfuncs.getShoreAndBottomLocations(DUMMY_SMALL_MATRIX,
                testfuncs.getDirectionMap(DUMMY_SMALL_MATRIX)))
                .to.deep.equal(DUMMY_SMALL_MATRIX_SHORES);
        expect(testfuncs.getShoreAndBottomLocations(IMPLODING_MATRIX,
                testfuncs.getDirectionMap(IMPLODING_MATRIX)).length)
                .to.equal(6);
        expect(testfuncs.getShoreAndBottomLocations(LAND_MAP,
                testfuncs.getDirectionMap(LAND_MAP)).length)
                .to.equal(2);
    });

    it('test getUpstreams', () => {
        expect(testfuncs.getUpstreams(2, 2, testfuncs.getDirectionMap(LAND_MAP)))
                .to.deep.equal(LAND_MAP_2_2_UPSTREAMS);
        expect(testfuncs.getUpstreams(0, 1, testfuncs.getDirectionMap(LAND_MAP)))
                .to.deep.equal(LAND_MAP_0_1_UPSTREAMS);
        expect(testfuncs.getUpstreams(2, 0, testfuncs.getDirectionMap(LAND_MAP)))
                .to.be.empty;
        expect(testfuncs.getUpstreams(1, 1, testfuncs.getDirectionMap(FLOW_VOLUME_MAP)).length)
                .to.equal(3);
    });

    it('test getVolume', () => {
        expect(testfuncs.getVolume(1, 1, FLOW_VOLUME_PRECIP, testfuncs.getDirectionMap(FLOW_VOLUME_MAP)))
               .to.equal(1);
        expect(testfuncs.getVolume(1, 1, FLOW_RECURSION_PRECIP, testfuncs.getDirectionMap(FLOW_RECURSION_MAP)))
               .to.be.closeTo(0.3, 0.00001);
        expect(testfuncs.getVolume(2, 2, FLOW_RECURSION_PRECIP, testfuncs.getDirectionMap(FLOW_RECURSION_MAP)))
               .to.be.closeTo(2.75, 0.00001);
    });

    it('test calculateRiverMap', () => {
        expect(riverMap(FLOW_RECURSION_MAP, FLOW_RECURSION_PRECIP, 1))
               .to.deep.equal(FLOW_RECURSION_RIVERMAP_CUTOFF_1);
        expect(riverMap(FLOW_RECURSION_MAP, FLOW_RECURSION_PRECIP, 0.5))
               .to.deep.equal(FLOW_RECURSION_RIVERMAP_CUTOFF_HALF);
        expect(riverMap(FLOW_VOLUME_MAP, FLOW_VOLUME_PRECIP, 0.8))
               .to.deep.equal(FLOW_VOLUME_RIVERMAP_CUTOFF_0_8);
    });

    it('stress test calculateRiverMap', () => {
        let heightMap = simplexGenerator(50, "altitude");
        let precipMap = simplexGenerator(50, "precip");
        let bigRivers = riverMap(heightMap, precipMap, 3);
        let allRivers = riverMap(heightMap, precipMap, 1.5);
        // Count rivers
        let bigRiverLength = [].concat(...bigRivers).filter(e => e < 9).length
        let allRiverLength = [].concat(...allRivers).filter(e => e < 9).length
        let landCount = [].concat(...heightMap).filter(e => e >= constants.ALTITUDE_ADJUST).length;
        assert(allRiverLength >= bigRiverLength);
        assert(landCount > allRiverLength);
        // console.log(`All River Length: ${allRiverLength}, Big River Length: ${bigRiverLength}, Land Count: ${landCount}`);
    });
})
