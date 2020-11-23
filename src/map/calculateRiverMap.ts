import * as constants from '../constant/constants';

export default function calculateRiverMap(heightMap: number[][],
    precipMap: number[][], cutoff: number): number[][] {
    // returns an array of directions.    
    return getDirectionMap(heightMap);
}

function getDirectionMap(heightMap): number[][] {
    let size = heightMap.length;
    let directionMap: number[][] = [];
    for (let y = 0; y < size; y++) {
        let latitude = [];
        for (let x = 0; x < size; x++) {
            latitude.push(getDirection(x, y, heightMap));
        }
        directionMap.push(latitude);
    }
    return directionMap;
}

function getArr(index: number, size: number): number[] {
    if (index < 0 || index >= size) {
        throw new RangeError();
    }
    let arr = [index-1, index, index+1];
    if (index == 0) {
        arr.splice(0, 1);
    } else if (index == size-1) {
        arr.splice(2, 1);
    }
    return arr;
}

function getDirection(x: number, y: number, heightMap): number {
    let size = heightMap.length;
    let xArr = getArr(x, size);
    let yArr = getArr(y, size);
    let thisHeight = heightMap[y][x];
    let direction = 4;
    let maxDiff = 0;
    yArr.forEach(i => {
        xArr.forEach(j => {
            let currHeight = heightMap[i][j];
            let diffHeight = thisHeight - currHeight;
            if (diffHeight > maxDiff) {
                maxDiff = diffHeight;
                direction = (j - x + 1)*3 + i - y + 1;
            }
        })
    })
    return direction
}

export const testfuncs = {
    getDirection: getDirection,
    getArr: getArr,
    getDirectionMap: getDirectionMap
}
