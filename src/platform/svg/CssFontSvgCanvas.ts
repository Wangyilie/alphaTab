import { TextAlign } from '@src/platform/ICanvas';
import { SvgCanvas } from '@src/platform/svg/SvgCanvas';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';

/**
 * This SVG canvas renders the music symbols by adding a CSS class 'at' to all elements.
 */
export class CssFontSvgCanvas extends SvgCanvas {
    public constructor() {
        super();
    }

    public fillMusicFontSymbol(
        x: number,
        y: number,
        scale: number,
        symbol: MusicFontSymbol,
        centerAtPosition?: boolean,
        numberValue?: number,
        pitch?: number
    ): void {
        if (symbol === MusicFontSymbol.None) {
            return;
        }
        numberValue === undefined ? this.fillMusicFontSymbolText(x, y, scale, `&#${symbol};`, centerAtPosition)
            : this.fillMusicFontSymbolText4Numbered(x, y, scale, numberValue, pitch);
    }

    public fillMusicFontSymbols(
        x: number,
        y: number,
        scale: number,
        symbols: MusicFontSymbol[],
        centerAtPosition?: boolean
    ): void {
        let s: string = '';
        for (let symbol of symbols) {
            if (symbol !== MusicFontSymbol.None) {
                s += `&#${symbol};`;
            }
        }
        this.fillMusicFontSymbolText(x, y, scale, s, centerAtPosition);
    }

    private fillMusicFontSymbolText(
        x: number,
        y: number,
        scale: number,
        symbols: string,
        centerAtPosition?: boolean
    ): void {
        this.buffer += `<g transform="translate(${x} ${y})" class="at" ><text`;
        if (scale !== 1) {
            this.buffer += ` style="font-size: ${scale * 100}%; stroke:none"`;
        } else {
            this.buffer += ' style="stroke:none"';
        }
        if (this.color.rgba !== '#000000') {
            this.buffer += ` fill="${this.color.rgba}"`;
        }
        if (centerAtPosition) {
            this.buffer += ' text-anchor="' + this.getSvgTextAlignment(TextAlign.Center) + '"';
        }
        this.buffer += `>${symbols}</text></g>`;
    }

    private fillMusicFontSymbolText4Numbered(
        x: number,
        y: number,
        scale: number,
        numberValue?: number,
        pitch?: number
    ): void {
        this.buffer += `<g transform="translate(${x} ${y})" class="at" style="font-size: 24px;"><text`;
        if (scale !== 1) {
            this.buffer += ` style="font-size: ${scale * 100}%; stroke:none"`;
        } else {
            this.buffer += ' style="stroke:none"';
        }
        if (this.color.rgba !== '#000000') {
            this.buffer += ` fill="${this.color.rgba}"`;
        }

        this.buffer += ` text-anchor="middle">${numberValue}</text>`;
        if (pitch) {
            if (pitch < 0) {
                this.buffer += `<circle r="2" cy="5" style="stroke: none; fill:${this.color.rgba};" />`;
                if (pitch < -1) {
                    this.buffer += `<circle r="2" cy="10" style="stroke: none; fill:${this.color.rgba};" />`;
                }
            } else if (pitch > 0) {
                this.buffer += `<circle r="2" cy="-21" style="stroke: none; fill:${this.color.rgba};" />`;
                if (pitch > 1) {
                    this.buffer += `<circle r="2" cy="-26" style="stroke: none; fill:${this.color.rgba};" />`;
                }
            }
        }
        

        this.buffer += `</g>`;
    }
}
