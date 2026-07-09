import { RiPauseCircleFill, RiPlayCircleFill, RiErrorWarningLine } from 'react-icons/ri';
import cn from 'clsx';

import { Image, Spinner, TextBlock } from '@usm/ui';

import {
  JamBot,
  JamBotTraitDisplay,
  getJamBotBio,
  getJamBotStyleTags,
  getJamBotTraitDisplays
} from '../../data/jamBots';
import { AuditionPlaybackStatus } from '../../hooks/useAuditionPlayer';

import styles from './Gallery.scss';

export interface JamBotCardProps {
  bot: JamBot;
  isPlaying: boolean;
  status: AuditionPlaybackStatus;
  onToggle: (bot: JamBot) => void;
}

function clampTraitPosition(value: number) {
  return Math.max(0, Math.min(100, value));
}

function TraitSpectrum({ trait }: { trait: JamBotTraitDisplay }) {
  return (
    <div className={styles.traitSpectrum}>
      <div className={styles.traitSpectrumHeader}>
        <span className={styles.traitSpectrumLabel}>{trait.label}</span>
        <span className={styles.traitSpectrumDescriptor}>{trait.descriptor}</span>
      </div>
      <div className={styles.traitSpectrumTrack}>
        <span
          className={styles.traitSpectrumMarker}
          style={{ left: `${clampTraitPosition(trait.value)}%` }}
        />
      </div>
      <div className={styles.traitSpectrumPoles}>
        <span>{trait.lowPole}</span>
        <span>{trait.highPole}</span>
      </div>
    </div>
  );
}

export function JamBotCard({ bot, isPlaying, status, onToggle }: JamBotCardProps) {
  const isLoading = isPlaying && status === 'loading';
  const isError = isPlaying && status === 'error';

  const isActivelyPlaying = isPlaying && status === 'playing';
  const styleTags = getJamBotStyleTags(bot.traits);

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
          <p>{getJamBotBio(bot, styleTags)}</p>
        </TextBlock>
        <div className={styles.traits}>
          {getJamBotTraitDisplays(bot.traits).map((trait) => (
            <TraitSpectrum key={trait.key} trait={trait} />
          ))}
        </div>
        <div className={styles.styleTags}>
          {styleTags.map((tag) => (
            <span key={tag} className={styles.styleTag}>
              {tag}
            </span>
          ))}
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
