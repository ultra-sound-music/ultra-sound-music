import {
  Accordian,
  AnimatedMeter,
  Badges,
  Grid,
  Image,
  Link,
  Pill,
  TextBlock
} from '@usm/ui';
import { copy } from '@usm/content';
import logo from '@usm/assets/img/logo.png';
import jambot2 from '@usm/assets/img/hero_jambot2.png';
import { urls, team, faq } from '@usm/content';
import { ReactComponent as Triangle1 } from '@usm/assets/img/triangle1.svg';
import { ReactComponent as Triangle3 } from '@usm/assets/img/triangle3.svg';

import ComingSoon from '../ComingSoon/ComingSoon';
import NewDrop from '../NewDrop/NewDrop';

import styles from './Landing.scss';

export function Landing() {
  const params = new URLSearchParams(window.location.search);
  const weAreLive =
    params.get('wearelive') === 'true' || params.get('wearelive') === '1';

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
        <div className={styles.section}>
          {weAreLive ? <NewDrop /> : <ComingSoon />}
        </div>

        {/* section #2 */}
        <div className={styles.section}>
          <Grid className={styles.grid2}>
            <div className={styles.jambot2}>
              <Image src={jambot2} className={styles.jambot2Image} />
            </div>
            <div>
              <TextBlock
                subject={copy.whatAreJambots}
                title={copy.blockchainMusicians}
              >
                <p>{copy.musicByMusicians}</p>
              </TextBlock>
            </div>
          </Grid>
        </div>

        {/* section #3 */}
        <div className={styles.section}>
          <Grid className={styles.grid2}>
            <TextBlock
              subject={copy.uniqueAndIndividual}
              title={copy.jambotTraits}
            >
              <p>{copy.jambotTraitsDescription}</p>
            </TextBlock>
            <div className={styles.badges}>
              <Badges names={['debut', 'hometown', 'version']} />
            </div>
            <TextBlock>
              <h4>{copy.characterTraits}</h4>
              <p>{copy.characterTraitsDescription}</p>
            </TextBlock>
            <div className={styles.characterTraits}>
              <div data-tip='almost insane'>
                <AnimatedMeter meter={1} label='sanity' value={[30, 30]} />
              </div>
              <div data-tip='low key'>
                <AnimatedMeter meter={2} label='fame' value={[30, 30]} />
              </div>
              <div data-tip='in the clouds'>
                <AnimatedMeter meter={3} label='swagger' value={[30, 30]} />
              </div>
            </div>
            <TextBlock>
              <h4>{copy.audioTraits}</h4>
              <p>{copy.audioTraitsDescription}</p>
            </TextBlock>
            <div className={styles.audioTraits}>
              <Pill label='energy'>aggressive</Pill>
              <Pill label='texture'>wide</Pill>
              <Pill label='space'>smooth</Pill>
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
                    <Link to={`${urls.twitter}/${member.twitter}`}>
                      @{member.twitter}
                    </Link>
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
                <Accordian term={t.q} details={t.a} />
              </div>
            ))}
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default Landing;
