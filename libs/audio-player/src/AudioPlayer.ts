import { loadAudio } from '@usm/util/loader';

export const WHEN_TIME = 0;
export const START_TIME = 0;

export type TAudioUrl = string;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop(): void {}

export interface ILogger {
  info: (message?: unknown, ...optionalParams: unknown[]) => void;
  error: (message?: unknown, ...optionalParams: unknown[]) => void;
}

export interface IUsmPlayerEvent {
  id: string;
  audioUrl: string;
  isPlaying: boolean;
  currentTime: number;
}

export interface IUsmPlayerProps {
  logger?: ILogger;
  onLoad?: () => void;
  onPlay?: () => void;
  onStop?: () => void;
}

export interface IUsmPlayerPlayArgs {
  id: string;
  audioUrl: string;
}

const defaultLogger: ILogger = {
  info: console && console.info,
  error: console && console.error
};

export default class UsmPlayer {
  logger = defaultLogger;
  currentId = '';
  currentUrl = '';
  currentTime = START_TIME;
  isPlaying = false;
  audioContext: AudioContext;
  audioSource: AudioBufferSourceNode | undefined;
  onLoad: (e: IUsmPlayerEvent) => void;
  onPlay: (e: IUsmPlayerEvent) => void;
  onStop: (e: IUsmPlayerEvent) => void;

  constructor({ logger, onLoad, onPlay, onStop }: IUsmPlayerProps = {}) {
    if (logger) {
      this.logger = logger;
    }

    this.audioContext = new AudioContext();

    this.onLoad = onLoad || noop;
    this.onPlay = onPlay || noop;
    this.onStop = onStop || noop;
  }

  connectAudioSource = (audioBuffer: AudioBuffer): AudioBufferSourceNode => {
    const audioSource = this.audioContext.createBufferSource();
    this.audioSource = audioSource;

    audioSource.buffer = audioBuffer;
    audioSource.connect(this.audioContext.destination);
    this.onLoad({
      id: this.currentId,
      audioUrl: this.currentUrl,
      currentTime: this.currentTime,
      isPlaying: this.isPlaying
    });
    return audioSource;
  };

  reConnectAudioSource = (): AudioBufferSourceNode => {
    return this.connectAudioSource(this.audioSource.buffer);
  };

  loadAudio = async (audioUrl: TAudioUrl): Promise<AudioBuffer> => {
    const arrayBuffer = await loadAudio(audioUrl);
    if (!arrayBuffer) {
      return;
    }

    return await this.audioContext.decodeAudioData(arrayBuffer);
  };

  play = async ({
    id = '',
    audioUrl = ''
  }: IUsmPlayerPlayArgs): Promise<void> => {
    if (!audioUrl) {
      this.logger.info('audioUrl must be provided');
      return;
    }

    if (this.currentUrl !== audioUrl) {
      this.currentId = id;
      this.currentUrl = audioUrl;
      this.currentTime = 0;
      const audioBuffer = await this.loadAudio(audioUrl);

      if (this.isPlaying) {
        this.stop();
      }

      this.connectAudioSource(audioBuffer);
    } else {
      this.reConnectAudioSource();
    }

    this.audioSource.start(WHEN_TIME, this.currentTime);
    this.isPlaying = true;
    this.onPlay({
      id: this.currentId,
      audioUrl: this.currentUrl,
      currentTime: this.currentTime,
      isPlaying: this.isPlaying
    });
  };

  pause(): void {
    this.currentTime = this.audioContext.currentTime;
    this.audioSource.stop();
    this.isPlaying = false;
    this.onStop({
      id: this.currentId,
      audioUrl: this.currentUrl,
      currentTime: this.currentTime,
      isPlaying: this.isPlaying
    });
  }

  stop(): void {
    this.currentTime = 0;
    this.audioSource.stop();
    this.isPlaying = false;
    this.onStop({
      id: this.currentId,
      audioUrl: this.currentUrl,
      currentTime: this.currentTime,
      isPlaying: this.isPlaying
    });
  }
}
