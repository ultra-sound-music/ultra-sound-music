import { useInView } from 'react-intersection-observer';
import cn from 'clsx';

import {
  Accordion,
  AnimatedMeter,
  Badges,
  Grid,
  Image,
  Link,
  MusicalTrait,
  TextBlock
} from '@usm/ui';
import { copy } from '@usm/content';
import config from '@usm/config';
import logo from '@usm/assets/img/logo.png';
import jambot2 from '@usm/assets/img/hero_jambot2.png';
import { urls, team, faq } from '@usm/content';
import { ReactComponent as Triangle1 } from '@usm/assets/img/triangle1.svg';
import { ReactComponent as Triangle3 } from '@usm/assets/img/triangle3.svg';

import ComingSoon from '../ComingSoon/ComingSoon';
import AuctionContainer from '../AuctionContainer/AuctionContainer';

import styles from './Landing.scss';

export function Landing() {
  const { ref: characterTraitsRef, inView: characterTraitsInView } = useInView({
    triggerOnce: true,
    rootMargin: '-150px 0px'
  });

  const { ref: musicalTraitsRef, inView: musicalTraitsInView } = useInView({
    triggerOnce: true,
    rootMargin: '-150px 0px'
  });

  const { ref: badgesRef, inView: badgesInView } = useInView({
    triggerOnce: true,
    rootMargin: '-100px 0px'
  });

  const weAreLive = config.weAreLive;
  return (
    <div className={styles.Landing}>
      <div className={styles.tri1}>
        <Triangle1 />
      </div>
      <div className={styles.tri3}>
        <Triangle3 />
      </div>

      <div className={styles.brandedDropJambots}>
        {/* section #1 */}
        <div className={cn(styles.section, weAreLive && styles.live)}>
          {weAreLive ? <AuctionContainer /> : <ComingSoon />}
        </div>

        {/* section #2 */}
        <div className={styles.section}>
          <Grid className={styles.grid2}>
            <div className={styles.jambot2}>
              <Image src={jambot2} className={styles.jambot2Image} />
            </div>
            <div>
              <TextBlock subject={copy.whatAreJambots} title={copy.blockchainMusicians}>
                <p>{copy.musicByMusicians}</p>
              </TextBlock>
            </div>
          </Grid>
        </div>

        {/* section #3 */}
        <div className={styles.section}>
          <Grid className={styles.grid2}>
            <TextBlock subject={copy.uniqueAndIndividual} title={copy.jambotTraits}>
              <p>{copy.jambotTraitsDescription}</p>
            </TextBlock>
            <div className={styles.badges} ref={badgesRef}>
              <Badges play={badgesInView} names={['debut', 'hometown', 'version']} />
            </div>
            <TextBlock>
              <div className={styles.subhead}>{copy.characterTraits}</div>
              <p>{copy.characterTraitsDescription}</p>
            </TextBlock>
            <div className={styles.characterTraits} ref={characterTraitsRef}>
              <AnimatedMeter
                play={characterTraitsInView}
                meter={1}
                label='sanity'
                name='almost insane'
                value={[5, 7]}
              />
              <AnimatedMeter
                play={characterTraitsInView}
                meter={2}
                label='fame'
                name='low key'
                value={[10, 12]}
              />
              <AnimatedMeter
                play={characterTraitsInView}
                meter={3}
                label='swagger'
                name='in the clouds'
                value={[6, 10]}
              />
            </div>
            <TextBlock>
              <div className={styles.subhead}>{copy.musicalTraits}</div>
              <p>{copy.musicalTraitsDescription}</p>
            </TextBlock>
            <div className={styles.musicalTraits} ref={musicalTraitsRef}>
              <MusicalTrait name='energy' value='upbeat' play={musicalTraitsInView} />
              <MusicalTrait name='melody' value='complex' play={musicalTraitsInView} />
              <MusicalTrait name='texture' value='harmonic' play={musicalTraitsInView} />
            </div>
          </Grid>
        </div>
      </div>

      {/* section #4 */}
      <div className={styles.section}>
        <Grid className={styles.grid2}>
          <div>
            <TextBlock title={copy.whatsUSM}>
              <p>{copy.theUSMPlatform}</p>
              <p>{copy.ourMission}</p>
              <p>{copy.musicalDeconstruction}</p>
            </TextBlock>
          </div>
          <div className={styles.logo}>
            <Image src={logo} className={styles.logoImg} />
          </div>
        </Grid>
      </div>

      {/* section #5 */}
      <div className={styles.section}>
        <Grid className={styles.gridFull}>
          <div>
            <h2>{copy.road_crew}</h2>
            <div className={styles.roadcrew}>
              {team.map((member) => (
                <div key={member.twitter}>
                  <h4 className={styles.crewLink}>
                    <Link to={`${urls.twitter}/${member.twitter}`}>@{member.twitter}</Link>
                  </h4>
                  <div>{member.blurb}</div>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </div>

      <div className={styles.section}>
        <Grid className={styles.gridFull}>
          <div>
            <h2>{copy.frequently_asked_questions}</h2>
            {faq.map((t, i) => (
              <div key={i} className={styles.faq}>
                <Accordion term={t.q} details={t.a} />
              </div>
            ))}
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default Landing;
