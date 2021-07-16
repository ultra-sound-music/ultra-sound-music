import * as Tone from 'tone';
import { generateAudioFromWallet, generateTrackAudioFrom4Wallets } from './generate';

let isInitialized = false;
export const toggleSingleArtistPlayback = async (address) => {
    console.log('toggleSingleArtistPlayback', { address, isInitialized });

    if (!isInitialized) {
        await Tone.start();
        isInitialized = true;
    }

    generateAudioFromWallet(address);

    Tone.Transport.toggle();

    if (Tone.Transport.state === 'started') {
        console.log('toggleSingleArtistPlayback', 'PLAYING ARTIST');
        return true;
    }
    console.log('toggleSingleArtistPlayback', 'STOPPED ARTIST');
    return false;
};

export const toggleTrackAudioPlayback = async (
    trackMinterAddress,
    bandmate1Address,
    bandmate2Address,
    bandmate3Address,
) => {
    console.log('toggleTrackAudioPlayback', {
        trackMinterAddress,
        bandmate1Address,
        bandmate2Address,
        bandmate3Address,
    });

    if (!isInitialized) {
        await Tone.start();
        isInitialized = true;
    }

    generateTrackAudioFrom4Wallets(
        trackMinterAddress,
        bandmate1Address,
        bandmate2Address,
        bandmate3Address,
    );

    Tone.Transport.toggle();

    if (Tone.Transport.state === 'started') {
        console.log('toggleTrackAudioPlayback', 'PLAYING TRACK');
        return true;
    }
    console.log('toggleTrackAudioPlayback', 'STOPPED TRACK');
    return false;
}

export const downloadAudio = async (address) => {
    console.log('downloadAudio', { address, isInitialized });

    if (!address) {
        console.log('downloadAudio', 'NO ADDRESS GIVEN');
        return false;
    }

    if (!isInitialized) {
        await Tone.start();
    }

    generateAudioFromWallet(address);

    const recorder = new Tone.Recorder();
    Tone.getDestination().connect(recorder);
    recorder.start();
    Tone.Transport.stop();
    Tone.Transport.start();

    setTimeout(async () => {
        console.log('downloadAudio', 'DOWNLOADING FILE');
        Tone.Transport.stop();
        // the recorded audio is returned as a blob
        const recording = await recorder.stop();
        // download the recording by creating an anchor element and blob url
        const url = URL.createObjectURL(recording);
        const anchor = document.createElement('a');
        anchor.download = `artist_audio_${address}.webm`;
        anchor.href = url;
        anchor.click();
    }, 3000);
};
