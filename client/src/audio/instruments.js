import * as Tone from 'tone';

export const salamanderKeys = new Tone.Sampler({
  urls: {
    C1: 'C1.mp3',
    C2: 'C2.mp3',
    C3: 'C3.mp3',
    C4: 'C4.mp3',
    'D#4': 'Ds4.mp3',
    'F#4': 'Fs4.mp3',
    A4: 'A4.mp3'
  },
  volume: -8,
  release: 1,
  baseUrl: 'https://tonejs.github.io/audio/salamander/'
}).toDestination();

const drumCompress = new Tone.Compressor({
  threshold: -30,
  ratio: 10,
  attack: 0.01,
  release: 0.2
}).toDestination();

const distortion = new Tone.Distortion({
  distortion: 0.4,
  wet: 0.4
});

export const snare = new Tone.Player({
  url: 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3',
  volume: -25,
  fadeOut: 0.1
}).chain(distortion, drumCompress);

export const hats = new Tone.Player({
  url: 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3',
  volume: -10,
  fadeOut: 0.01
}).chain(distortion, drumCompress);

export const kick = new Tone.MembraneSynth({
  pitchDecay: 0.02,
  octaves: 6,
  oscillator: {
    type: 'square4'
  },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0
  },
  volume: -10
}).connect(drumCompress);

export const monoBass = new Tone.MonoSynth({
  volume: -16,
  envelope: {
    attack: 0.01,
    decay: 0.01,
    release: 0.01
  },
  filterEnvelope: {
    attack: 0.001,
    decay: 0.01,
    sustain: 0.1,
    baseFrequency: 200,
    octaves: 1.6
  }
}).toDestination();
