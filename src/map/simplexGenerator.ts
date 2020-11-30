import SimplexNoise from 'simplex-noise';

const DEFAULT_OCTAVES = {
    bands: [
        [0.5, 2],
        [1, 1],
        [2, 0.5],
        [4, 0.3]
    ],
    exponent: 1.0
}

const ALTITUDE_OCTAVES = {
    bands: [
        [0.5, 1],
        [1, 1],
        [2, 0.5],
        [4, 0.3],
        [8, 0.1],
    ],
    exponent: 2.0
}

const PRECIP_OCTAVES = {
    bands: [
        [0.5, 2],
        [1, 1],
        [2, 0.5]
    ],
    exponent: 1.5
}

const TYPE_MAP = {
    "default": DEFAULT_OCTAVES,
    "altitude": ALTITUDE_OCTAVES,
    "precip": PRECIP_OCTAVES
}

function getNoise(noise: SimplexNoise) {
    return function(x: number, y:number): number {
        return noise.noise2D(x,y)/2 + 0.5;
    }
}

export default function generate(size, dtype): number[][] {
    let noise = new SimplexNoise();
    let map: number[][] = [];
    let octaves = TYPE_MAP[dtype];
    // Prevent predictable mapping by adding random offsets to each octave
    let offSets = [];
    for (let i = 0; i < octaves.bands.length; i++) {
        offSets.push(Math.random()/2 - 0.5);
    }
    for (let y = 0; y < size; y++) {
        map.push([]);
        for (let x = 0; x < size; x++) {
            let nx = x/size - 0.5;
            let ny = y/size - 0.5;
            let sumValue = 0
            let sumWeight = 0
            octaves.bands.forEach((val, index) => {
                let param = val[0];
                let weight = val[1];
                let offSet = offSets[index];
                sumValue += weight * getNoise(noise)(param * (nx - offSet), param * (ny - offSet));
                sumWeight += weight;
            })
            let value = Math.pow((sumValue/sumWeight), octaves.exponent);
            map[y][x] = value;
        }
    }
    return map;
}
