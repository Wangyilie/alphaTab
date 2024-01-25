import { GeneralMidi } from '@src/midi/GeneralMidi';
import { Beat } from '@src/model/Beat';
import { Duration } from '@src/model/Duration';
import { Fingers } from '@src/model/Fingers';
import { Score } from '@src/model/Score';
import { FingeringMode } from '@src/NotationSettings';
import { Settings } from '@src/Settings';
import { KeySignatureType } from './KeySignatureType';

export class TuningParseResult {
    public note: string | null = null;
    public noteValue: number = 0;
    public octave: number = 0;

    public get realValue(): number {
        return this.octave * 12 + this.noteValue;
    }
}

/**
 * This public class contains some utilities for working with model public classes
 */
export class ModelUtils {
    public static getIndex(duration: Duration): number {
        let index: number = 0;
        let value: number = duration;
        if (value < 0) {
            return index;
        }
        return Math.log2(duration) | 0;
    }

    public static keySignatureIsFlat(ks: number): boolean {
        return ks < 0;
    }

    public static keySignatureIsNatural(ks: number): boolean {
        return ks === 0;
    }

    public static keySignatureIsSharp(ks: number): boolean {
        return ks > 0;
    }

    public static applyPitchOffsets(settings: Settings, score: Score): void {
        for (let i: number = 0; i < score.tracks.length; i++) {
            if (i < settings.notation.displayTranspositionPitches.length) {
                for (let staff of score.tracks[i].staves) {
                    staff.displayTranspositionPitch = -settings.notation.displayTranspositionPitches[i];
                }
            }
            if (i < settings.notation.transpositionPitches.length) {
                for (let staff of score.tracks[i].staves) {
                    staff.transpositionPitch = -settings.notation.transpositionPitches[i];
                }
            }
        }
    }

    public static fingerToString(settings: Settings, beat: Beat, finger: Fingers, leftHand: boolean): string | null {
        if (
            settings.notation.fingeringMode === FingeringMode.ScoreForcePiano ||
            settings.notation.fingeringMode === FingeringMode.SingleNoteEffectBandForcePiano ||
            GeneralMidi.isPiano(beat.voice.bar.staff.track.playbackInfo.program)
        ) {
            switch (finger) {
                case Fingers.Unknown:
                case Fingers.NoOrDead:
                    return null;
                case Fingers.Thumb:
                    return '1';
                case Fingers.IndexFinger:
                    return '2';
                case Fingers.MiddleFinger:
                    return '3';
                case Fingers.AnnularFinger:
                    return '4';
                case Fingers.LittleFinger:
                    return '5';
                default:
                    return null;
            }
        }
        if (leftHand) {
            switch (finger) {
                case Fingers.Unknown:
                case Fingers.NoOrDead:
                    return '0';
                case Fingers.Thumb:
                    return 'T';
                case Fingers.IndexFinger:
                    return '1';
                case Fingers.MiddleFinger:
                    return '2';
                case Fingers.AnnularFinger:
                    return '3';
                case Fingers.LittleFinger:
                    return '4';
                default:
                    return null;
            }
        }
        switch (finger) {
            case Fingers.Unknown:
            case Fingers.NoOrDead:
                return null;
            case Fingers.Thumb:
                return 'p';
            case Fingers.IndexFinger:
                return 'i';
            case Fingers.MiddleFinger:
                return 'm';
            case Fingers.AnnularFinger:
                return 'a';
            case Fingers.LittleFinger:
                return 'c';
            default:
                return null;
        }
    }

    /**
     * Checks if the given string is a tuning inticator.
     * @param name
     */
    public static isTuning(name: string): boolean {
        return !!ModelUtils.parseTuning(name);
    }

    public static parseTuning(name: string): TuningParseResult | null {
        let note: string = '';
        let octave: string = '';
        for (let i: number = 0; i < name.length; i++) {
            let c: number = name.charCodeAt(i);
            if (c >= 0x30 && c <= 0x39 /* 0-9 */) {
                // number without note?
                if (!note) {
                    return null;
                }
                octave += String.fromCharCode(c);
            } else if ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a) || c === 0x23) /* A-Za-Z# */ {
                note += String.fromCharCode(c);
            } else {
                return null;
            }
        }
        if (!octave || !note) {
            return null;
        }
        let result: TuningParseResult = new TuningParseResult();
        result.octave = parseInt(octave) + 1;
        result.note = note.toLowerCase();
        result.noteValue = ModelUtils.getToneForText(result.note);
        return result;
    }

    public static getTuningForText(str: string): number {
        let result: TuningParseResult | null = ModelUtils.parseTuning(str);
        if (!result) {
            return -1;
        }
        return result.realValue;
    }

    public static getToneForText(note: string): number {
        switch (note.toLowerCase()) {
            case 'c':
                return 0;
            case 'c#':
            case 'db':
                return 1;
            case 'd':
                return 2;
            case 'd#':
            case 'eb':
                return 3;
            case 'e':
                return 4;
            case 'f':
                return 5;
            case 'f#':
            case 'gb':
                return 6;
            case 'g':
                return 7;
            case 'g#':
            case 'ab':
                return 8;
            case 'a':
                return 9;
            case 'a#':
            case 'bb':
                return 10;
            case 'b':
                return 11;
            default:
                return 0;
        }
    }

    public static newGuid(): string {
        return (
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            '-' +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1) +
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1)
        );
    }

    public static isAlmostEqualTo(a: number, b: number): boolean {
        return Math.abs(a - b) < 0.00001;
    }

    public static toHexString(n: number, digits: number = 0): string {
        let s: string = '';
        let hexChars: string = '0123456789ABCDEF';
        do {
            s = String.fromCharCode(hexChars.charCodeAt(n & 15)) + s;
            n = n >> 4;
        } while (n > 0);
        while (s.length < digits) {
            s = '0' + s;
        }
        return s;
    }

    /**
     * 通过调性值与大小调两个参数，来返回一个由低两个8度、中间8度、高两个8度的音符值组成的二维数组
     * 已知 C大调 / c小调 的 do 音音符值为 60
     * 通过十二平均律的音程规律：大调的音程为 2212221，小调的音程为 2122212
     * 返回一个二维数组，第一个元素为自然音的音符值数组，第二个元素为变调后(升音)的音符值数组
     */
    public static getNoteValues(keySignatureStirng: string, keySignatureType: KeySignatureType): string[][] {
        let centerDoValue = ModelUtils.parseCenterDoValue(keySignatureStirng)
        const isMajor = keySignatureType === KeySignatureType.Major
        const majorIntervals = [2, 2, 1, 2, 2, 2, 1]
        const minorIntervals = [2, 1, 2, 2, 1, 2, 2]
        const intervals = isMajor ? majorIntervals : minorIntervals
        const result: string[] = []
        const resultAccidental: string[] = []

        let i = 0
        do {
            const doValues = this.getOneDimNoteValue(centerDoValue)
            const doValuesAccidental = this.getOneDimNoteValue(centerDoValue).map(item => item + 1)
            result.push(`#${doValues.join('#')}#`)
            resultAccidental.push(`#${doValuesAccidental.join('#')}#`)

            centerDoValue += intervals[i]
            i++
        } while (i < intervals.length) // 循环7次即可，因为一个八度只有7个音，第8个音就是第一个音的八度

        return [result, resultAccidental]
    }

    private static getOneDimNoteValue(noteValue: number): number[] {
        const noteValues: number[] = []
        for (let i = -2; i <= 2; i++) {
            noteValues.push(noteValue + (12 * i))
        }
        return noteValues
    }

    /**
     * 通过调号获取中间 Do 音值
     * @param str 
     * @returns 
     */
    public static parseCenterDoValue(str: string): number {
        if (!str) str = 'c'
        switch (str.toLowerCase()) {
            case 'cb':
            case 'cbmajor':
                return 59;
            case 'gb':
            case 'gbmajor':
            case 'g#minor':
            case 'f#':
            case 'f#minor':
            case 'f#major':
                return 66;
            case 'ab':
            case 'abmajor':
                return 56;
            case 'eb':
            case 'ebmajor':
            case 'ebminor':
            case 'd#minor':
                return 63;
            case 'bb':
            case 'bbmajor':
            case 'bbminor':
                return 58;
            case 'f':
            case 'fmajor':
            case 'fminor':
                return 65;
            case 'c':
            case 'cmajor':
            case 'cminor':
                return 60;
            case 'g':
            case 'gmajor':
            case 'gminor':
                return 67;
            case 'd':
            case 'dmajor':
            case 'dminor':
                return 62;
            case 'a':
            case 'amajor':
            case 'aminor':
                return 57;
            case 'e':
            case 'emajor':
            case 'eminor':
                return 64;
            case 'b':
            case 'bmajor':
            case 'bminor':
                return 59;
            case 'c#':
            case 'c#major':
            case 'c#minor':
            case 'db':
            case 'dbmajor':
                return 61;
            default:
                return 60;
        }
    }
}
