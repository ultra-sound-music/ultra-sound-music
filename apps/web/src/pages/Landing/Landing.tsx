import { Accordian, Grid, Image, Link, TextBlock, Section } from '@usm/ui';
import { copy } from '@usm/content';
import logo from '@usm/images/logo.png';
import jambot2 from '@usm/images/hero_jambot2.png';
import traitsImg from '@usm/images/traits.png';
import { urls, team, faq } from '@usm/content';
import { ReactComponent as Triangle1 } from '@usm/images/triangle1.svg';
import { ReactComponent as Triangle3 } from '@usm/images/triangle3.svg';

import ComingSoon from '../../components/ComingSoon/ComingSoon';
import NewDrop from '../../components/NewDrop/NewDrop';

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
        <Section className={styles.heroSection}>
          {weAreLive ? <NewDrop /> : <ComingSoon />}
        </Section>

        {/* section #2 */}
        <Section>
          <Grid className={styles.grid2}>
            <div className={styles.jambot2}>
              <Image src={jambot2} className={styles.jambot2Image} />
            </div>
            <div>
              <TextBlock
                subject={copy.introducingTheJambots}
                title={copy.blockchainMusicians}
              >
                <p>{copy.musicByMusicians}</p>
              </TextBlock>
            </div>
          </Grid>
        </Section>

        {/* section #3 */}
        <Section>
          <Grid className={styles.grid2}>
            <div>
              <TextBlock
                subject={copy.uniqueAndIndividual}
                title={copy.jambotTraits}
              >
                <h4>{copy.personalTraits}</h4>
                <p>{copy.jambotTraitsDescription}</p>
                <h4>{copy.audioTraits}</h4>
                <p>{copy.audioTraitsDescription}</p>
              </TextBlock>
            </div>
            <div className={styles.logo}>
              <Image src={traitsImg} className={styles.traitsImage}/>
            </div>
          </Grid>
        </Section>
      </div>

      {/* section #4 */}
      <Section>
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
      </Section>

      {/* section #5 */}
      <Section>
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
      </Section>

      <Section>
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
      </Section>
    </div>
  );
}

export default Landing;
