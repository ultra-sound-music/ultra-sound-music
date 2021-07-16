import * as Tone from 'tone';
import { salamanderKeys, snare, hats, kick, monoBass } from './instruments';
import { charsToDrumInput, charsToKeysInput, charsToBassInput } from './parse';

let kickSeq;
let snareSeq;
let hihatSeq;
let keysSeq;
let bassSeq;

const ACCOUNTS = [
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
    '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
]

const DEFAULT_BPM = 56;

export const generateTrackAudioFrom4Wallets = (
    trackMinterAddress = ACCOUNTS[0],
    bandmate1Address = ACCOUNTS[1],
    bandmate2Address = ACCOUNTS[2],
    bandmate3Address = ACCOUNTS[3]
) => {
    if (!trackMinterAddress || !bandmate1Address || !bandmate2Address || !bandmate3Address) {
        console.error('generateTrackAudioFrom4Wallets', 'MISSING AN ADDRESS', {
            trackMinterAddress,
            bandmate1Address,
            bandmate2Address,
            bandmate3Address,
        });
        return;
    }

    console.log('generateTrackAudioFrom4Wallets', {
        trackMinterAddress,
        bandmate1Address,
        bandmate2Address,
        bandmate3Address,
    });

    let splitArr = trackMinterAddress.split('x');
    const fortyChars = []
    fortyChars[0] = splitArr[1].toLowerCase();

    splitArr = bandmate1Address.split('x');
    fortyChars[1] = splitArr[1].toLowerCase();

    splitArr = bandmate2Address.split('x');
    fortyChars[2] = splitArr[1].toLowerCase();

    splitArr = bandmate3Address.split('x');
    fortyChars[3] = splitArr[1].toLowerCase();

    const kickChars =
        fortyChars[0].substring(0, 8) +
        fortyChars[1].substring(0, 8) +
        fortyChars[2].substring(0, 8) +
        fortyChars[3].substring(0, 8)
    const snareChars =
        fortyChars[0].substring(8, 16) +
        fortyChars[1].substring(8, 16) +
        fortyChars[2].substring(8, 16) +
        fortyChars[3].substring(8, 16)
    const hihatChars =
        fortyChars[0].substring(16, 24) +
        fortyChars[1].substring(16, 24) +
        fortyChars[2].substring(16, 24) +
        fortyChars[3].substring(16, 24)
    const keysChars =
        fortyChars[0].substring(24, 32) +
        fortyChars[1].substring(24, 32) +
        fortyChars[2].substring(24, 32) +
        fortyChars[3].substring(24, 32)
    const bassChars =
        fortyChars[0].substring(32, 40) +
        fortyChars[1].substring(32, 40) +
        fortyChars[2].substring(32, 40) +
        fortyChars[3].substring(32, 40)

    const kickInput = charsToDrumInput(kickChars);
    console.log('generateTrackAudioFrom4Wallets', { kickInput });
    if (kickSeq) kickSeq.dispose();
    kickSeq = new Tone.Sequence((time, note) => {
        if (note === '*') {
            kick.triggerAttack('C1', time);
        }
    }, kickInput).start(0);

    const snareInput = charsToDrumInput(snareChars);
    console.log('generateTrackAudioFrom4Wallets', { snareInput });
    if (snareSeq) snareSeq.dispose();
    snareSeq = new Tone.Sequence((time, note) => {
        if (note === '*') {
            snare.start(time);
        }
    }, snareInput).start(0);

    const hihatInput = charsToDrumInput(hihatChars);
    console.log('generateTrackAudioFrom4Wallets', { hihatInput });
    if (hihatSeq) hihatSeq.dispose();
    hihatSeq = new Tone.Sequence((time, note) => {
        if (note === '*') {
            hats.start(time);
        }
    }, hihatInput).start(0);

    const keysInput = charsToKeysInput(keysChars);
    console.log('generateTrackAudioFrom4Wallets', { keysInput });
    if (keysSeq) keysSeq.dispose();
    keysSeq = new Tone.Sequence((time, note) => {
        if (note !== '') {
            //console.log('time', time, note);
            salamanderKeys.triggerAttackRelease(note, '8n');
        }
    }, keysInput).start(0);

    const bassInput = charsToBassInput(bassChars);
    console.log('generateTrackAudioFrom4Wallets', { bassInput });
    if (bassSeq) bassSeq.dispose();
    bassSeq = new Tone.Sequence((time, note) => {
        if (note !== '') {
            //console.log('time', time, note);
            monoBass.triggerAttackRelease(note, '16n');
        }
    }, bassInput).start(0);

    Tone.Transport.bpm.value = DEFAULT_BPM;
}

export const generateAudioFromWallet = (address) => {
    if (!address) {
        console.error('generateAudioFromWallet', 'NO ADDRESS GIVEN');
        return;
    }

    console.log('generateAudioFromWallet', { address })

    const splitArr = address.split('x');
    const fortyChars = splitArr[1].toLowerCase();

    // console.log('fortyChars', fortyChars, fortyChars.length);

    const kickInput = charsToDrumInput(fortyChars.substring(0, 8));
    console.log('generateAudioFromWallet', { kickInput });
    if (kickSeq) kickSeq.dispose();
    kickSeq = new Tone.Sequence((time, note) => {
        if (note === '*') {
            kick.triggerAttack('C1', time);
        }
    }, kickInput).start(0);

    const snareInput = charsToDrumInput(fortyChars.substring(8, 16));
    console.log('generateAudioFromWallet', { snareInput });
    if (snareSeq) snareSeq.dispose();
    snareSeq = new Tone.Sequence((time, note) => {
        if (note === '*') {
            snare.start(time);
        }
    }, snareInput).start(0);

    if (keysSeq) keysSeq.dispose();
    if (bassSeq) bassSeq.dispose();

    Tone.Transport.bpm.value = DEFAULT_BPM;

    /*
    const hihatInput = charsToDrumInput(fortyChars.substring(16, 24));
    console.log('hihatInput', hihatInput);
    if (hihatSeq) hihatSeq.dispose();
    hihatSeq = new Tone.Sequence((time, note) => {
        if (note === '*') {
            hats.start(time);
        }
    }, hihatInput).start(0);

    const keysInput = charsToKeysInput(fortyChars.substring(24, 32));
    console.log('keysInput', keysInput);
    if (keysSeq) keysSeq.dispose();
    keysSeq = new Tone.Sequence((time, note) => {
        if (note !== '') {
            console.log('time', time, note);
            salamanderKeys.triggerAttackRelease(note, '8n');
        }
    }, keysInput).start(0);

    const bassInput = charsToBassInput(fortyChars.substring(32, 40));
    console.log('bassInput', bassInput);
    if (bassSeq) bassSeq.dispose();
    bassSeq = new Tone.Sequence((time, note) => {
        if (note !== '') {
            console.log('time', time, note);
            monoBass.triggerAttackRelease(note, '16n');
        }
    }, bassInput).start(0);
    */

    Tone.Transport.bpm.value = DEFAULT_BPM;
};

