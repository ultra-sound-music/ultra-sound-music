import { RiPauseCircleFill, RiPlayCircleFill, RiErrorWarningLine } from 'react-icons/ri';
import cn from 'clsx';

import { Image, Spinner, TextBlock } from '@usm/ui';

import { JamBot } from '../../data/jamBots';
import { AuditionPlaybackStatus } from '../../hooks/useAuditionPlayer';

import styles from './Gallery.scss';

export interface JamBotCardProps {
  bot: JamBot;
  isPlaying: boolean;
  status: AuditionPlaybackStatus;
  onToggle: (bot: JamBot) => void;
}

function TraitBar({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.traitBar}>
      <div className={styles.traitBarLabel}>{label}</div>
      <div className={styles.traitBarTrack}>
        <div className={styles.traitBarFill} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function JamBotCard({ bot, isPlaying, status, onToggle }: JamBotCardProps) {
  const isLoading = isPlaying && status === 'loading';
  const isError = isPlaying && status === 'error';

  const isActivelyPlaying = isPlaying && status === 'playing';

  let playIcon = <RiPlayCircleFill />;
  let label = 'Hear excerpt';
  if (isLoading) {
    playIcon = <Spinner />;
    label = 'Loading…';
  } else if (isError) {
    playIcon = <RiErrorWarningLine />;
    label = 'Playback failed — try again';
  } else if (isActivelyPlaying) {
    playIcon = <RiPauseCircleFill />;
    label = 'Pause';
  }

  return (
    <div className={styles.JamBotCard}>
      <div className={styles.art}>
        <Image src={bot.image} fit='cover' className={styles.artImage} />
      </div>
      <div className={styles.body}>
        <TextBlock title={bot.name}>
          <p className={styles.credit}>{bot.performerCredit}</p>
          <p>{bot.bio}</p>
        </TextBlock>
        <div className={styles.traits}>
          <TraitBar label='spark' value={bot.traits.spark} />
          <TraitBar label='swagger' value={bot.traits.swagger} />
          <TraitBar label='fame' value={bot.traits.fame} />
          <TraitBar label='energy' value={bot.traits.energy} />
        </div>
        <div className={styles.styleTags}>
          <span className={styles.styleTag}>{bot.traits.melodicStyle}</span>
          <span className={styles.styleTag}>{bot.traits.rhythmicStyle}</span>
        </div>
        <button
          type='button'
          className={cn(styles.auditionButton, isError && styles.auditionButtonError)}
          onClick={() => onToggle(bot)}
        >
          {playIcon}
          <span>{label}</span>
        </button>
      </div>
    </div>
  );
}

export default JamBotCard;
