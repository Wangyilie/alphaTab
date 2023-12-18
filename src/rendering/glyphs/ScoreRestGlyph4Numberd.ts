import { Duration } from '@src/model/Duration';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { BeamingHelper } from '@src/rendering/utils/BeamingHelper';
import { MusicFontGlyph4Numbered } from './MusicFontGlyph4Numbered';
import { ICanvas } from '@src/platform/ICanvas';
import { ModelUtils } from '@src/model/ModelUtils';

export class ScoreRestGlyph4Numbered extends MusicFontGlyph4Numbered {
    private _duration: Duration;
    public beamingHelper!: BeamingHelper;

    public constructor(x: number, y: number, duration: Duration) {
        super(x, y, 1, ScoreRestGlyph4Numbered.getSymbol(duration), 0);
        this._duration = duration;
    }

    public static getSymbol(duration: Duration): MusicFontSymbol {
        switch (duration) {
            case Duration.QuadrupleWhole:
                return MusicFontSymbol.RestLonga;
            case Duration.DoubleWhole:
                return MusicFontSymbol.RestDoubleWhole;
            case Duration.Whole:
                return MusicFontSymbol.RestWhole;
            case Duration.Half:
                return MusicFontSymbol.RestHalf;
            case Duration.Quarter:
                return MusicFontSymbol.RestQuarter;
            case Duration.Eighth:
                return MusicFontSymbol.RestEighth;
            case Duration.Sixteenth:
                return MusicFontSymbol.RestSixteenth;
            case Duration.ThirtySecond:
                return MusicFontSymbol.RestThirtySecond;
            case Duration.SixtyFourth:
                return MusicFontSymbol.RestSixtyFourth;
            case Duration.OneHundredTwentyEighth:
                return MusicFontSymbol.RestOneHundredTwentyEighth;
            case Duration.TwoHundredFiftySixth:
                return MusicFontSymbol.RestTwoHundredFiftySixth;
            default:
                return MusicFontSymbol.None;
        }
    }

    public static getSize(duration: Duration): number {
        switch (duration) {
            case Duration.QuadrupleWhole:
            case Duration.DoubleWhole:
            case Duration.Whole:
            case Duration.Half:
            case Duration.Quarter:
            case Duration.Eighth:
            case Duration.Sixteenth:
                return 9;
            case Duration.ThirtySecond:
                return 12;
            case Duration.SixtyFourth:
                return 14;
            case Duration.OneHundredTwentyEighth:
            case Duration.TwoHundredFiftySixth:
                return 20;
        }
        return 10;
    }

    public override doLayout(): void {
        this.width = ScoreRestGlyph4Numbered.getSize(this._duration) * this.scale;
    }

    public updateBeamingHelper(cx: number): void {
        if (this.beamingHelper) {
            this.beamingHelper.registerBeatLineX(
                'score',
                this.beat!,
                cx + this.x + this.width / 2,
                cx + this.x + this.width / 2
            );
        }
    }
    public override paint(cx: number, cy: number, canvas: ICanvas): void {
        canvas.fillMusicFontSymbol(cx + this.x, cy + this.y + 10, this.glyphScale * this.scale, this.symbol, false, this.numberValue);
        // 为休止符画出音程线

        let barCount: number = ModelUtils.getIndex(this._duration) - 2;
        let barStart: number = cy + this.y;
        // if (direction === BeamDirection.Down && !isNumbered) {
        //     barSpacing = -barSpacing;
        //     barSize = -barSize;
        // }
        for (let barIndex: number = 0; barIndex < barCount; barIndex++) {
            let barStartX: number = 0;
            let barEndX: number = 0;
            let barY: number = barStart + barIndex * 6;
            barStartX = cx - 8;
            barEndX = cx;
            ScoreRestGlyph4Numbered.paintSingleBar(
                canvas,
                barStartX,
                barY + 13,
                barEndX + 8,
                barY + 13,
                2
            );
        }
    }
    private static paintSingleBar(canvas: ICanvas, x1: number, y1: number, x2: number, y2: number, size: number): void {
      canvas.beginPath();
      canvas.moveTo(x1, y1);
      canvas.lineTo(x2, y2);
      canvas.lineTo(x2, y2 + size);
      canvas.lineTo(x1, y1 + size);
      canvas.closePath();
      canvas.fill();
  }
}
