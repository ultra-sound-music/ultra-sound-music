import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { RiLinkM, RiPauseCircleFill, RiPlayCircleFill } from 'react-icons/ri';

import { Avatar, Grid, Link, Spinner, TextBlock } from '@usm/ui';
import { routes } from '@usm/content';

import { getDemoBand, getJamBot, JamBot } from '../../data/jamBots';
import { useAuditionPlayer } from '../../hooks/useAuditionPlayer';

import styles from './DemoBand.scss';

const COPIED_MESSAGE_MS = 2000;

export function DemoBand() {
  const { bandId } = useParams<{ bandId: string }>();
  const { playingId, status, toggle } = useAuditionPlayer();
  const [copied, setCopied] = useState(false);

  const band = bandId ? getDemoBand(bandId) : undefined;

  if (!band) {
    return (
      <Grid className={styles.DemoBand}>
        <TextBlock title='Band not found'>
          <p>
            We couldn't find that Band. <Link to={routes.gallery}>Back to the drop →</Link>
          </p>
        </TextBlock>
      </Grid>
    );
  }

  const members = band.memberIds
    .map(getJamBot)
    .filter((member): member is JamBot => Boolean(member));
  const isPlaying = playingId === band.id;
  const isActivelyPlaying = isPlaying && status === 'playing';
  const isLoading = isPlaying && status === 'loading';

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_MESSAGE_MS);
    } catch {
      // Clipboard access can fail (permissions, non-secure context); the URL is still
      // visible in the address bar, so there's nothing more useful to do here.
    }
  };

  return (
    <Grid className={styles.DemoBand}>
      <div className={styles.header}>
        <div className={styles.lineup}>
          {members.map((member) => (
            <Avatar key={member.id} src={member.image} size='medium' />
          ))}
        </div>
        <TextBlock title={band.name}>
          <p>{band.blurb}</p>
        </TextBlock>
      </div>

      <div className={styles.jamControls}>
        <button
          type='button'
          className={styles.jamButton}
          onClick={() => toggle(band.id, band.jamAudioUrl)}
        >
          {isLoading ? (
            <Spinner />
          ) : isActivelyPlaying ? (
            <RiPauseCircleFill />
          ) : (
            <RiPlayCircleFill />
          )}
          <span>{isActivelyPlaying ? 'Pause the jam' : 'Play the jam'}</span>
        </button>
        <button type='button' className={styles.shareButton} onClick={onShare}>
          <RiLinkM />
          <span>{copied ? 'Link copied!' : 'Copy link'}</span>
        </button>
      </div>

      <div className={styles.members}>
        {members.map((member) => (
          <div key={member.id} className={styles.member}>
            <div className={styles.memberName}>{member.name}</div>
            <div className={styles.memberCredit}>{member.performerCredit}</div>
          </div>
        ))}
      </div>
    </Grid>
  );
}

export default DemoBand;
