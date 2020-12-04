import processor from '../../src/repl/processor';
import { expect } from 'chai';


describe('replProcessor', () => {
    it('test command not found', () => {
        let result: string[] = processor(undefined, "BIEK");
        expect(result.length).to.equal(1);
        expect(result[0]).to.equal("command not found: BIEK");
    });
    it('test debug command', () => {
        let result: string[] = processor(undefined, "debug");
        expect(result.length).to.equal(0);
    });
    it('test debug command help', () => {
        let result: string[] = processor(undefined, "debug --help");
        expect(result.length).to.equal(3);
        expect(result[1]).to.equal("MULTILINE");
    });
    it('test debug command key value', () => {
        let result: string[] = processor(undefined, "debug --key=biek");
        expect(result.length).to.equal(3);
        expect(result[1]).to.equal("key=key, value=biek");
    });
    it('test help', () => {
        let result: string[] = processor(undefined, "help");
        expect(result).to.not.be.empty;
    });
    it('test man', () => {
        let result: string[] = processor(undefined, "man debug");
        expect(result.length).to.equal(3);
        expect(result[1]).to.equal("MULTILINE");
    });
});
