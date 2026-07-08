import { useCallback, useEffect, useRef, useState } from 'react';
import { UsmPlayer } from '@usm/audio-player';

export type AuditionPlaybackStatus = 'idle' | 'loading' | 'playing' | 'error';

export interface UseAuditionPlayerResult {
  playingId: string | null;
  status: AuditionPlaybackStatus;
  toggle: (id: string, audioUrl: string) => void;
  stop: () => void;
}

/**
 * Thin wrapper around @usm/audio-player's UsmPlayer for short walletless audition/demo
 * clips: tracks which single id is currently playing (starting a new clip stops any other),
 * loading/error state, and toggle-to-stop on repeat clicks. The player is only constructed
 * on the first play, inside a click handler, so AudioContext creation stays tied to a user
 * gesture (required on mobile Safari).
 */
export function useAuditionPlayer(): UseAuditionPlayerResult {
  const playerRef = useRef<UsmPlayer | null>(null);
  const mountedRef = useRef(false);
  const requestRef = useRef(0);
  const playingIdRef = useRef<string | null>(null);
  const statusRef = useRef<AuditionPlaybackStatus>('idle');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [status, setStatus] = useState<AuditionPlaybackStatus>('idle');

  const setPlaybackState = useCallback((id: string | null, nextStatus: AuditionPlaybackStatus) => {
    if (!mountedRef.current) {
      return;
    }

    playingIdRef.current = id;
    statusRef.current = nextStatus;
    setPlayingId(id);
    setStatus(nextStatus);
  }, []);

  const getPlayer = useCallback((): UsmPlayer => {
    if (!playerRef.current) {
      playerRef.current = new UsmPlayer({
        onPlay: ({ id }) => setPlaybackState(id, 'playing'),
        onStop: ({ id }) => {
          if (playingIdRef.current !== id) {
            return;
          }

          setPlaybackState(null, 'idle');
        }
      });
    }
    return playerRef.current;
  }, [setPlaybackState]);

  const stop = useCallback(() => {
    requestRef.current += 1;
    playerRef.current?.stop();
    setPlaybackState(null, 'idle');
  }, [setPlaybackState]);

  const toggle = useCallback(
    (id: string, audioUrl: string) => {
      const player = getPlayer();
      const currentId = playingIdRef.current;
      const currentStatus = statusRef.current;

      if (currentId === id && currentStatus === 'playing') {
        stop();
        return;
      }

      if (currentId === id && currentStatus === 'loading') {
        return;
      }

      const requestId = requestRef.current + 1;
      requestRef.current = requestId;
      setPlaybackState(id, 'loading');
      player
        .play({ id, audioUrl })
        .then(() => {
          if (
            requestRef.current !== requestId ||
            playingIdRef.current !== id ||
            statusRef.current !== 'loading'
          ) {
            return;
          }

          setPlaybackState(id, 'error');
        })
        .catch(() => {
          if (requestRef.current !== requestId || playingIdRef.current !== id) {
            return;
          }

          setPlaybackState(id, 'error');
        });
    },
    [getPlayer, setPlaybackState, stop]
  );

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestRef.current += 1;
      playerRef.current?.stop();
      playerRef.current = null;
    };
  }, []);

  return { playingId, status, toggle, stop };
}

export default useAuditionPlayer;
