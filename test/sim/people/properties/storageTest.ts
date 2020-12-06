import { Storage } from '../../../../src/sim/people/properties/storage';
import { ResourceType } from '../../../../src/sim/people/properties/resourceTypes';
import { expect } from 'chai';

describe('storage', () => {
    it('test storage', () => {
        let storage = new Storage();
        storage.addGold(10);
        storage.addResource(ResourceType.Food, 20);
        expect(storage.getResource(ResourceType.Food)).to.equal(20);
        storage.spendResource(ResourceType.Food, 5);
        expect(storage.getResource(ResourceType.Food)).to.equal(15);
        expect(storage.getResource(ResourceType.Wood)).to.equal(0);
        let nextStorage = new Storage();
        nextStorage.addResource(ResourceType.Wood, 3);
        let actual = nextStorage.spendResource(ResourceType.Wood, 5);
        expect(actual).to.equal(3);
        nextStorage.addResource(ResourceType.Wood, 3);
        nextStorage.addResource(ResourceType.Food, 3);
        nextStorage.addGold(3);
        let sumStorage = new Storage();
        sumStorage.mergeStorages([storage, nextStorage]);
        expect(sumStorage.getResource(ResourceType.Wood)).to.equal(3);
        expect(sumStorage.getResource(ResourceType.Food)).to.equal(18);
        expect(sumStorage.gold).to.equal(13);
    });
});


