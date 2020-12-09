import { argparse, KeyValue } from '../../src/repl/parser';
import { expect } from 'chai';

describe('repl:argparse', () => {
    it('test no args', () => {
        let result = argparse([]);
        expect(result).to.be.empty;
    });
    it('test simple args', () => {
        let result = argparse(['--help']);
        expect(result.length).to.equal(1);
        expect(result[0].key).to.equal('help');
        expect(result[0].value).to.be.undefined;
    });
    it('test keyval args', () => {
        let result = argparse(['--lol=lipop']);
        expect(result.length).to.equal(1);
        expect(result[0].key).to.equal('lol');
        expect(result[0].value).to.equal('lipop');
    });
    it('test multiple keyval args', () => {
        let result = argparse(['--show','--lol=lipop']);
        expect(result.length).to.equal(2);
        expect(result[0].key).to.equal('show');
        expect(result[0].value).to.be.undefined;
        expect(result[1].key).to.equal('lol');
        expect(result[1].value).to.equal('lipop');
    });
});
