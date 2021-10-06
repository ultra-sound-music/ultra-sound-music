import load from './loader';

export const WHEN_TIME = 0;
export const START_TIME = 0;

export type TAudioUrl = string;

export interface ILogger {
  info: (message?: unknown, ...optionalParams: unknown[]) => void;
  error: (message?: unknown, ...optionalParams: unknown[]) => void;
}

export interface IUsmPlayerProps {
  logger?: ILogger;
}

const defaultLogger: ILogger = {
  info: console && console.info,
  error: console && console.error
};

export default class UsmPlayer {
  logger = defaultLogger;
  currentTime = START_TIME;
  audioContext: AudioContext;
  audioSource: AudioBufferSourceNode;

  constructor({ logger }: IUsmPlayerProps = {}) {
    this.logger = logger;
    this.audioContext = new AudioContext();
  }

  loadAudio = async (audioUrl: TAudioUrl): Promise<AudioBufferSourceNode> => {
    const arrayBuffer = await load(audioUrl);
    if (!arrayBuffer) {
      return;
    }

    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    const audioSource = this.audioContext.createBufferSource();

    this.audioSource = audioSource;
    audioSource.buffer = audioBuffer;
    audioSource.connect(this.audioContext.destination);
    return audioSource;
  };

  play = async (audioUrl: TAudioUrl = ''): Promise<void> => {
    if (!audioUrl) {
      this.logger.info('audioUrl must be provided');
    }

    await this.loadAudio(audioUrl);

    const startTime = this.currentTime;
    this.audioSource.start(WHEN_TIME, startTime);
  };

  pause(): void {
    this.currentTime = this.audioContext.currentTime;
    this.stop();
  }

  stop(): void {
    this.currentTime = 0;
    this.audioSource.stop();
  }
}