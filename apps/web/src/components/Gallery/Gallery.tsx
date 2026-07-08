import { Grid, Link, TextBlock } from '@usm/ui';
import { routes } from '@usm/content';

import { jamBots, demoBands } from '../../data/jamBots';
import { useAuditionPlayer } from '../../hooks/useAuditionPlayer';

import JamBotCard from './JamBotCard';

import styles from './Gallery.scss';

export function Gallery() {
  const { playingId, status, toggle } = useAuditionPlayer();
  const demoBand = demoBands[0];

  return (
    <div className={styles.Gallery}>
      <Grid className={styles.intro}>
        <TextBlock title='The Drop'>
          <p>
            Meet the Jam Bots. Hear a short excerpt from each Artist below — no wallet required.
          </p>
        </TextBlock>
      </Grid>

      <div className={styles.cards}>
        {jamBots.map((bot) => (
          <JamBotCard
            key={bot.id}
            bot={bot}
            isPlaying={playingId === bot.id}
            status={status}
            onToggle={(b) => toggle(b.id, b.auditionAudioUrl)}
          />
        ))}
      </div>

      {demoBand && (
        <Grid className={styles.demoBandTeaser}>
          <TextBlock title='Bands are the point'>
            <p>
              Owners form Bands with friends. Here's what one sounds like:{' '}
              <Link to={routes.demoBand.replace(':bandId', demoBand.id)}>{demoBand.name} →</Link>
            </p>
          </TextBlock>
        </Grid>
      )}
    </div>
  );
}

export default Gallery;
