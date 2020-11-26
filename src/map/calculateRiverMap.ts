import * as mapConstants from '../constant/mapConstants';

export default function calculateRiverMap(heightMap: number[][],
        precipMap: number[][], cutoff: number): number[][] {
    // Returns an array of direction where sufficient waterflow volume exists.
    let size = heightMap.length;
    let directionMap = getDirectionMap(heightMap);
    let riverMap: number[][] = [];
    for (let y = 0; y < size; y++) {
        let latitude = []
        for (let x = 0; x < size; x++) {
            if (heightMap[y][x] >= mapConstants.ALTITUDE_ADJUST) {
                if (getVolume(x, y, precipMap, directionMap) > cutoff) {
                    latitude.push(directionMap[y][x]);
                } else {
                    latitude.push(9);
                }
            } else {
                latitude.push(9);
            }
        }
        riverMap.push(latitude);
    }
    return riverMap;
}

function getVolume(x, y, precipMap, directionMap): number {
    let upstreams = getUpstreams(x, y, directionMap);
    let volume = precipMap[y][x];
    upstreams.forEach(upstream => {
        volume += getVolume(upstream[0], upstream[1], precipMap, directionMap);
    });
    return volume;
}

function getUpstreams(x, y, directionMap): number[][] {
    let upstreams: number[][] = [];
    let size = directionMap.length;
    let xArr = getArr(x, size);
    let yArr = getArr(y, size);
    yArr.forEach(i => {
        xArr.forEach(j => {
            if (!(x == j && y == i)) {
                let direction = mapConstants.DIRECTIONS.get(directionMap[i][j]);
                if (direction[0] == x-j && direction[1] == y-i) {
                    upstreams.push([j, i]);
                }
            }
        })
    })
    return upstreams;
}

function getShoreAndBottomLocations(heightMap, directionMap): number[][] {
    let locList: number[][] = [];
    let size = heightMap.length;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (heightMap[y][x] >= mapConstants.ALTITUDE_ADJUST) {
                if (directionMap[y][x] == 4) {
                    locList.push([x,y]);
                } else {
                    let direction = mapConstants.DIRECTIONS.get(directionMap[y][x]);
                    let destination = [x + direction[0], y + direction[1]];
                    if (heightMap[destination[1]][destination[0]] < mapConstants.ALTITUDE_ADJUST) {
                        locList.push([x,y]);
                    }
                }
            }
        }
    }
    return locList;
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
    getDirectionMap: getDirectionMap,
    getShoreAndBottomLocations: getShoreAndBottomLocations,
    getUpstreams: getUpstreams,
    getVolume: getVolume,
}
