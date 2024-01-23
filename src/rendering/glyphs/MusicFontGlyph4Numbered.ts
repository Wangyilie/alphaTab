import { ICanvas } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { Duration } from '@src/model';

export class MusicFontGlyph4Numbered extends EffectGlyph {
  protected glyphScale: number = 0;
  protected symbol: MusicFontSymbol;
  protected numberValue: number;
  protected pitch: number | undefined;

  public constructor(x: number, y: number, glyphScale: number, symbol: MusicFontSymbol, numberValue: number, pitch?: number, duration?: Duration) {
    super(x, y);
    this.glyphScale = glyphScale;
    this.symbol = symbol;
    this.numberValue = numberValue;
    this.pitch = pitch;
  }

  public override paint(cx: number, cy: number, canvas: ICanvas): void {
    canvas.fillMusicFontSymbol(cx + this.x, cy + this.y, this.glyphScale * this.scale, this.symbol, false, this.numberValue);
  }
}
