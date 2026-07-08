import { act, render } from '@testing-library/react';
import { UsmPlayer } from '@usm/audio-player';
import type { IUsmPlayerEvent, IUsmPlayerProps } from '@usm/audio-player';

import { useAuditionPlayer, UseAuditionPlayerResult } from './useAuditionPlayer';

interface MockUsmPlayer {
  props: IUsmPlayerProps;
  play: jest.Mock<Promise<void>, [{ id: string; audioUrl: string }]>;
  stop: jest.Mock<void, []>;
}

let mockPlayerInstances: MockUsmPlayer[] = [];
let mockPlayPromise: Promise<void> | undefined;

jest.mock('@usm/audio-player', () => ({
  UsmPlayer: jest.fn().mockImplementation((props: IUsmPlayerProps) => {
    const player: MockUsmPlayer = {
      props,
      play: jest.fn(() => mockPlayPromise || Promise.resolve()),
      stop: jest.fn()
    };
    mockPlayerInstances.push(player);
    return player;
  })
}));

function eventFor(id: string, audioUrl: string, isPlaying: boolean): IUsmPlayerEvent {
  return {
    id,
    audioUrl,
    isPlaying,
    currentTime: 0
  };
}

function Harness({ onRender }: { onRender: (result: UseAuditionPlayerResult) => void }) {
  const result = useAuditionPlayer();
  onRender(result);
  return null;
}

describe('useAuditionPlayer', () => {
  const MockUsmPlayerConstructor = UsmPlayer as unknown as jest.Mock;

  beforeEach(() => {
    mockPlayerInstances = [];
    mockPlayPromise = new Promise(() => undefined);
    MockUsmPlayerConstructor.mockClear();
  });

  it('does not issue a second play request while the same clip is loading', async () => {
    let result!: UseAuditionPlayerResult;
    render(<Harness onRender={(nextResult) => (result = nextResult)} />);

    await act(async () => {
      result.toggle('violin', '/audio/violin.mp3');
    });
    await act(async () => {
      result.toggle('violin', '/audio/violin.mp3');
    });

    expect(mockPlayerInstances[0].play).toHaveBeenCalledTimes(1);
    expect(result.playingId).toBe('violin');
    expect(result.status).toBe('loading');
  });

  it('keeps the next clip active when the previous clip reports stopped during handoff', async () => {
    let result!: UseAuditionPlayerResult;
    render(<Harness onRender={(nextResult) => (result = nextResult)} />);

    await act(async () => {
      result.toggle('violin', '/audio/violin.mp3');
    });
    act(() => {
      mockPlayerInstances[0].props.onPlay?.(eventFor('violin', '/audio/violin.mp3', true));
    });
    await act(async () => {
      result.toggle('mandolin', '/audio/mandolin.mp3');
    });
    act(() => {
      mockPlayerInstances[0].props.onStop?.(eventFor('violin', '/audio/violin.mp3', false));
    });

    expect(result.playingId).toBe('mandolin');
    expect(result.status).toBe('loading');

    act(() => {
      mockPlayerInstances[0].props.onPlay?.(eventFor('mandolin', '/audio/mandolin.mp3', true));
    });

    expect(result.playingId).toBe('mandolin');
    expect(result.status).toBe('playing');
  });

  it('stops the player when the owning page unmounts', async () => {
    let result!: UseAuditionPlayerResult;
    const { unmount } = render(<Harness onRender={(nextResult) => (result = nextResult)} />);

    await act(async () => {
      result.toggle('violin', '/audio/violin.mp3');
    });

    unmount();

    expect(mockPlayerInstances[0].stop).toHaveBeenCalledTimes(1);
  });
});
