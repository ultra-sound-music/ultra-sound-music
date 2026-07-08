import { loadAudio } from '@usm/util-loader';

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
  onLoad?: (e: IUsmPlayerEvent) => void;
  onPlay?: (e: IUsmPlayerEvent) => void;
  onStop?: (e: IUsmPlayerEvent) => void;
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
  audioBuffer: AudioBuffer | undefined;
  playRequestId = 0;
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

  createEvent = (id = this.currentId, audioUrl = this.currentUrl): IUsmPlayerEvent => ({
    id,
    audioUrl,
    currentTime: this.currentTime,
    isPlaying: this.isPlaying
  });

  stopCurrentSource = (cancelPendingPlay = true): void => {
    if (cancelPendingPlay) {
      this.playRequestId += 1;
    }

    const id = this.currentId;
    const audioUrl = this.currentUrl;
    const audioSource = this.audioSource;

    this.currentTime = START_TIME;
    this.isPlaying = false;
    this.audioSource = undefined;

    if (audioSource) {
      audioSource.onended = null;
      audioSource.stop();
    }

    this.onStop(this.createEvent(id, audioUrl));
  };

  connectAudioSource = (
    audioBuffer: AudioBuffer,
    id = this.currentId,
    audioUrl = this.currentUrl
  ): AudioBufferSourceNode => {
    const audioSource = this.audioContext.createBufferSource();
    this.audioSource = audioSource;
    this.audioBuffer = audioBuffer;

    audioSource.buffer = audioBuffer;
    audioSource.connect(this.audioContext.destination);
    audioSource.onended = () => {
      // stop()/pause() already set isPlaying=false synchronously before calling
      // audioSource.stop(), which also fires this same 'ended' event — skip the
      // duplicate callback and only report natural playback completion here. The
      // source identity check also keeps old 'ended' events from clearing newer
      // playback after a quick handoff.
      if (this.audioSource !== audioSource || !this.isPlaying) {
        return;
      }
      this.isPlaying = false;
      this.currentTime = START_TIME;
      this.audioSource = undefined;
      this.onStop(this.createEvent(id, audioUrl));
    };
    this.onLoad(this.createEvent(id, audioUrl));
    return audioSource;
  };

  reConnectAudioSource = (): AudioBufferSourceNode => {
    // Only called from play()'s "same URL" branch, which is unreachable until a prior
    // play() has already run connectAudioSource() at least once.
    if (!this.audioBuffer) {
      throw new Error('Cannot reconnect audio source before audio is loaded');
    }

    return this.connectAudioSource(this.audioBuffer);
  };

  loadAudio = async (audioUrl: TAudioUrl): Promise<AudioBuffer | undefined> => {
    const arrayBuffer = await loadAudio(audioUrl);
    if (!arrayBuffer) {
      return;
    }

    return await this.audioContext.decodeAudioData(arrayBuffer);
  };

  play = async ({ id = '', audioUrl = '' }: IUsmPlayerPlayArgs): Promise<void> => {
    if (!audioUrl) {
      this.logger.info('audioUrl must be provided');
      return;
    }

    const playRequestId = this.playRequestId + 1;
    this.playRequestId = playRequestId;

    let audioSource: AudioBufferSourceNode;
    if (this.currentUrl !== audioUrl || !this.audioBuffer) {
      const audioBuffer = await this.loadAudio(audioUrl);
      if (this.playRequestId !== playRequestId) {
        return;
      }

      if (!audioBuffer) {
        return;
      }

      if (this.isPlaying) {
        this.stopCurrentSource(false);
      }

      this.currentId = id;
      this.currentUrl = audioUrl;
      this.currentTime = START_TIME;
      audioSource = this.connectAudioSource(audioBuffer, id, audioUrl);
    } else {
      if (this.isPlaying) {
        this.stopCurrentSource(false);
      }

      this.currentId = id;
      this.currentUrl = audioUrl;
      audioSource = this.reConnectAudioSource();
    }

    audioSource.start(WHEN_TIME, this.currentTime);
    this.isPlaying = true;
    this.onPlay(this.createEvent());
  };

  pause(): void {
    this.currentTime = this.audioContext.currentTime;
    const id = this.currentId;
    const audioUrl = this.currentUrl;
    const audioSource = this.audioSource;
    this.playRequestId += 1;
    this.isPlaying = false;
    this.audioSource = undefined;

    if (audioSource) {
      audioSource.onended = null;
      audioSource.stop();
    }

    this.onStop(this.createEvent(id, audioUrl));
  }

  stop(): void {
    this.stopCurrentSource();
  }
}
