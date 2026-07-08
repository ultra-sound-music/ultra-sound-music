import { loadAudio } from '@usm/util-loader';

import UsmPlayer from './AudioPlayer';

jest.mock('@usm/util-loader', () => ({
  loadAudio: jest.fn()
}));

class MockAudioBufferSourceNode {
  buffer: AudioBuffer | null = null;
  onended: (() => void) | null = null;
  connect = jest.fn();
  start = jest.fn();
  stop = jest.fn(() => {
    this.onended?.();
  });
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((innerResolve, innerReject) => {
    resolve = innerResolve;
    reject = innerReject;
  });

  return { promise, resolve, reject };
}

describe('UsmPlayer', () => {
  const mockLoadAudio = loadAudio as jest.MockedFunction<typeof loadAudio>;
  let sources: MockAudioBufferSourceNode[];
  let decodeAudioData: jest.Mock<Promise<AudioBuffer>, [ArrayBuffer]>;

  beforeEach(() => {
    sources = [];
    decodeAudioData = jest
      .fn<Promise<AudioBuffer>, [ArrayBuffer]>()
      .mockResolvedValue({} as AudioBuffer);
    mockLoadAudio.mockResolvedValue(new ArrayBuffer(1));

    (global as unknown as { AudioContext: typeof AudioContext }).AudioContext = jest
      .fn()
      .mockImplementation(() => ({
        currentTime: 0,
        destination: {},
        createBufferSource: jest.fn(() => {
          const source = new MockAudioBufferSourceNode();
          sources.push(source);
          return source as unknown as AudioBufferSourceNode;
        }),
        decodeAudioData
      }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('UsmPlayer constructor', () => {
    it('returns an instance of UsmPlayer', () => {
      const usmPlayer = new UsmPlayer();

      expect(usmPlayer).toBeInstanceOf(UsmPlayer);
    });
  });

  it('reports the stopped clip, then reports the new active clip when switching sources', async () => {
    const onPlay = jest.fn();
    const onStop = jest.fn();
    const usmPlayer = new UsmPlayer({ onPlay, onStop });

    await usmPlayer.play({ id: 'violin', audioUrl: '/audio/violin.mp3' });
    await usmPlayer.play({ id: 'mandolin', audioUrl: '/audio/mandolin.mp3' });

    expect(onStop).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'violin', audioUrl: '/audio/violin.mp3', isPlaying: false })
    );
    expect(onPlay).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'mandolin', audioUrl: '/audio/mandolin.mp3', isPlaying: true })
    );
    expect(usmPlayer.currentId).toBe('mandolin');
    expect(usmPlayer.isPlaying).toBe(true);
  });

  it('ignores ended events from a source that is no longer current', async () => {
    const onStop = jest.fn();
    const usmPlayer = new UsmPlayer({ onStop });

    await usmPlayer.play({ id: 'violin', audioUrl: '/audio/violin.mp3' });
    const staleEnded = sources[0].onended;
    await usmPlayer.play({ id: 'mandolin', audioUrl: '/audio/mandolin.mp3' });

    staleEnded?.();

    expect(onStop).toHaveBeenCalledTimes(1);
    expect(onStop).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'violin', audioUrl: '/audio/violin.mp3', isPlaying: false })
    );
    expect(usmPlayer.currentId).toBe('mandolin');
    expect(usmPlayer.isPlaying).toBe(true);
  });

  it('does not start an older load after a newer play request wins', async () => {
    const slowLoad = deferred<ArrayBuffer>();
    const fastLoad = deferred<ArrayBuffer>();
    const onPlay = jest.fn();
    const usmPlayer = new UsmPlayer({ onPlay });

    mockLoadAudio.mockImplementation((url) => {
      if (url === '/audio/slow.mp3') {
        return slowLoad.promise;
      }

      return fastLoad.promise;
    });

    const slowPlay = usmPlayer.play({ id: 'slow', audioUrl: '/audio/slow.mp3' });
    const fastPlay = usmPlayer.play({ id: 'fast', audioUrl: '/audio/fast.mp3' });

    fastLoad.resolve(new ArrayBuffer(1));
    await fastPlay;
    slowLoad.resolve(new ArrayBuffer(1));
    await slowPlay;

    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPlay).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'fast', audioUrl: '/audio/fast.mp3', isPlaying: true })
    );
    expect(usmPlayer.currentId).toBe('fast');
    expect(usmPlayer.isPlaying).toBe(true);
  });

  it('cancels a pending load when stopped before playback starts', async () => {
    const slowLoad = deferred<ArrayBuffer>();
    const onPlay = jest.fn();
    const onStop = jest.fn();
    const usmPlayer = new UsmPlayer({ onPlay, onStop });

    mockLoadAudio.mockReturnValue(slowLoad.promise);
    const pendingPlay = usmPlayer.play({ id: 'violin', audioUrl: '/audio/violin.mp3' });

    usmPlayer.stop();
    slowLoad.resolve(new ArrayBuffer(1));
    await pendingPlay;

    expect(onPlay).not.toHaveBeenCalled();
    expect(onStop).toHaveBeenCalledWith(
      expect.objectContaining({ id: '', audioUrl: '', isPlaying: false })
    );
    expect(usmPlayer.isPlaying).toBe(false);
  });
});
