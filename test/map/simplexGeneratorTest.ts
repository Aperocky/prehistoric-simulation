import generator from '../../src/map/simplexGenerator';
import { expect, assert } from 'chai';

describe('simplexGenerator', () => {
    it('creates 10x10 default map', () => {
        let map = generator(10, "default");
        expect(map.length).to.equal(10);
        expect(map[0].length).to.equal(10);
        // Expect all values to be between 0 and 1
        let flatMap = [].concat(...map);
        assert(flatMap.every((e) => e < 1 && e > 0));
    })

    it('scale to 100x100', () => {
        let map = generator(100, "default");
        expect([].concat(...map).length).to.equal(10000);
    })
})
