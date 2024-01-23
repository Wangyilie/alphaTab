import { Duration } from '@src/model/Duration';
import { ICanvas } from '@src/platform/ICanvas';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { MusicFontGlyph4Numbered } from './MusicFontGlyph4Numbered';

export class NoteHeadGlyph4Numbered extends MusicFontGlyph4Numbered {
    public static readonly GraceScale: number = 0.75;
    public static readonly NoteHeadHeight: number = 8;
    public static readonly QuarterNoteHeadWidth: number = 9;
    private _isGrace: boolean;
    private _duration: Duration;

    // 36 \ 48 \ 60 \ 72 \ 84
    // 38 \ 50 \ 62 \ 74 \ 86
    // 40 \ 52 \ 64 \ 76 \ 88
    // 41 \ 53 \ 65 \ 77 \ 89
    // 43 \ 55 \ 67 \ 79 \ 91
    // 45 \ 57 \ 69 \ 81 \ 93
    // 47 \ 59 \ 71 \ 83 \ 95
    private static NoteValues = [
        '#36#48#60#72#84#', // c
        '#38#50#62#74#86#', // d
        '#40#52#64#76#88#', // e
        '#41#53#65#77#89#', // f
        '#43#55#67#79#91#', // g
        '#45#57#69#81#93#', // a
        '#47#59#71#83#95#'  // b
    ];

    // 变音后的 value
    private static AccidentalNoteValues = [
        '#37#49#61#73#85#', // c#/db
        '#39#51#63#75#87#', // d#/eb
        '#41#53#65#77#89#', // e#/fb
        '#42#54#66#78#90#', // f#/gb
        '#44#56#68#80#92#', // g#/ab
        '#46#58#70#82#94#',  // a#/bb
        ''
    ]
    private static _isAccidental: boolean;

    public constructor(x: number, y: number, duration: Duration, isGrace: boolean, displayValue: number) {
        super(x,
              y,
              isGrace ? NoteHeadGlyph4Numbered.GraceScale : 1,
              NoteHeadGlyph4Numbered.getSymbol(duration),
              NoteHeadGlyph4Numbered.getDisplayValue(displayValue),
              NoteHeadGlyph4Numbered.getPitch(displayValue));
        this._isGrace = isGrace;
        this._duration = duration;
        NoteHeadGlyph4Numbered._isAccidental = false
    }

    public override paint(cx: number, cy: number, canvas: ICanvas): void {
        let offset: number = this._isGrace ? this.scale : this.numberValue ? 23 : 0;
        canvas.fillMusicFontSymbol(cx + this.x, cy + this.y + offset, this.glyphScale * this.scale, this.symbol, false, this.numberValue, this.pitch, this._duration);
    }

    public override doLayout(): void {
        let scale: number = (this._isGrace ? NoteHeadGlyph4Numbered.GraceScale : 1) * this.scale;
        switch (this._duration) {
            case Duration.QuadrupleWhole:
                this.width = 14 * scale;
                break;
            case Duration.DoubleWhole:
                this.width = 14 * (this._isGrace ? NoteHeadGlyph4Numbered.GraceScale : 1) * this.scale;
                break;
            case Duration.Whole:
                this.width = 14 * (this._isGrace ? NoteHeadGlyph4Numbered.GraceScale : 1) * this.scale;
                break;
            default:
                this.width = NoteHeadGlyph4Numbered.QuarterNoteHeadWidth * (this._isGrace ? NoteHeadGlyph4Numbered.GraceScale : 1) * this.scale;
                break;
        }
        this.height = NoteHeadGlyph4Numbered.NoteHeadHeight * scale;
    }

    private static getSymbol(duration: Duration): MusicFontSymbol {
      switch (duration) {
          case Duration.QuadrupleWhole:
              return MusicFontSymbol.NoteheadDoubleWholeSquare;
          case Duration.DoubleWhole:
              return MusicFontSymbol.NoteheadDoubleWhole;
          case Duration.Whole:
              return MusicFontSymbol.NoteheadWhole;
          case Duration.Half:
              return MusicFontSymbol.NoteheadHalf;
          default:
              return MusicFontSymbol.NoteheadBlack;
      }
    }

    private static getDisplayIndex(displayValue: number): number {
        const displayString = `#${displayValue}#`;
        let index = NoteHeadGlyph4Numbered.NoteValues.findIndex(item => item.indexOf(displayString) >= 0);
        if (index === -1) {
            index = NoteHeadGlyph4Numbered.AccidentalNoteValues.findIndex(item => item.indexOf(displayString) >= 0);
            this._isAccidental = index !== -1
        }
        return index;
    }

    private static getDisplayValue(displayValue: number): number {
        const index = NoteHeadGlyph4Numbered.getDisplayIndex(displayValue);
        switch (index) {
            case 0:
                return MusicFontSymbol.do;
            case 1:
                return MusicFontSymbol.re;
            case 2:
                return MusicFontSymbol.mi;
            case 3:
                return MusicFontSymbol.fa;
            case 4:
                return MusicFontSymbol.sol;
            case 5:
                return MusicFontSymbol.la;
            case 6:
                return MusicFontSymbol.si;
            default:
                return MusicFontSymbol.None;
        }
    }

    private static getPitch(displayValue: number): number {
        const index = NoteHeadGlyph4Numbered.getDisplayIndex(displayValue);
        const group = this._isAccidental ? NoteHeadGlyph4Numbered.AccidentalNoteValues[index].split('#') : NoteHeadGlyph4Numbered.NoteValues[index].split('#');
        const pitch = group.findIndex(i => i === `${displayValue}`);
        return pitch - 3;
    }
}
