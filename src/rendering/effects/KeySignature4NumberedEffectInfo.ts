import { Beat } from '@src/model/Beat';
import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { EffectBarGlyphSizing } from '@src/rendering/EffectBarGlyphSizing';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { EffectBarRendererInfo } from '@src/rendering/EffectBarRendererInfo';
import { TextGlyph } from '@src/rendering/glyphs/TextGlyph';
import { Settings } from '@src/Settings';
import { NotationElement } from '@src/NotationSettings';
import { TextAlign } from '@src/platform/ICanvas';

export class KeySignature4NumberedEffectInfo extends EffectBarRendererInfo {
    public get notationElement(): NotationElement {
        return NotationElement.KeySignature4Numbered;
    }

    public get hideOnMultiTrack(): boolean {
        return true;
    }

    public get canShareBand(): boolean {
        return false;
    }

    public get sizingMode(): EffectBarGlyphSizing {
        return EffectBarGlyphSizing.SinglePreBeat;
    }

    public shouldCreateGlyph(settings: Settings, beat: Beat): boolean {
        return (
          beat.voice.bar.staff.index === 0 &&
          beat.voice.index === 0 &&
          beat.index === 0 &&
          settings.core.numbered &&
          beat.voice.bar.index === 0
        )
    }

    public createNewGlyph(renderer: BarRendererBase, beat: Beat): EffectGlyph {
        const keySignature = beat.voice.bar.masterBar.keySignatureString;
        let ks = new RegExp('major').test(keySignature) ? keySignature.replace('major', '') : keySignature.replace('minor', '');
        
        ks = ks.replace(/b/, '♭').replace(/#/, '♯').toUpperCase();
        return new TextGlyph(0, 0, `1 = ${ks}`, renderer.resources.wordsFont, TextAlign.Left);
    }

    public canExpand(from: Beat, to: Beat): boolean {
        return true;
    }
}
