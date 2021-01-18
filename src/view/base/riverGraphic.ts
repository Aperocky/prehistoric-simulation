import * as displayConstants from '../../constant/displayConstants';
import * as mapConstants from '../../constant/mapConstants';
import { Square } from '../../map/square';

export class RiverGraphic extends PIXI.Graphics {

    // Link to the square that had the river
    square: Square;
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;
    lineWidth: number;

    constructor(square: Square) {
        super();
        this.square = square;
        this.getParams();
        this.draw();
    }

    private getParams(): void {
        let squareSize = displayConstants.DEFAULT_SQUARE_SIZE;
        let downstream = mapConstants.DIRECTIONS.get(this.square.flowDirection);
        this.xStart = this.square.x * squareSize + squareSize/2;
        this.yStart = this.square.y * squareSize + squareSize/2;
        this.xEnd = this.xStart + downstream[0] * squareSize;
        this.yEnd = this.yStart + downstream[1] * squareSize;
        this.lineWidth = this.getWidth();
    }

    private getWidth(): number {
        let width = 2;
        mapConstants.RIVER_WIDTH.forEach(w => {
            if (w[0] <= this.square.flowVolume) {
                width = w[1];
            }
        });
        return width;
    }

    private draw(): void {
        this.zIndex = 1;
        this.lineStyle(this.lineWidth, 0x10a5f5);
        this.moveTo(this.xStart, this.yStart);
        this.lineTo(this.xEnd, this.yEnd);
    }
}
