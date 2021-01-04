export function getColorFromRgb(r: number, g: number, b: number): number {
    return Math.floor(r)*256*256 + Math.floor(g)*256 + Math.floor(b);
}


export function getAlphaBlend(alphaColor: number[], baseColor: number[], alpha: number): number {
    let newColor: number[] = baseColor.map((n, i) => (1-alpha)*n + alpha*alphaColor[i]);
    return getColorFromRgb(newColor[0], newColor[1], newColor[2]);
}


export function colorScale(botColor: number[], topColor: number[], scale: number): number[] {
    let newColor: number[] = botColor.map((n, i) => n + (topColor[i] - n) * scale);
    return newColor;
}
