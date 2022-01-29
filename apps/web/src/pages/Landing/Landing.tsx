import {
  Accordian,
  Container,
  Col,
  Figure,
  Grid,
  Image,
  Link,
  TextBlock,
  Section
} from '@usm/ui';
import { copy } from '@usm/content';
import logo from '@usm/images/logo.png';
import { urls, team, faq } from '@usm/content';

import ComingSoon from '../../components/ComingSoon/ComingSoon';
import NewDrop from '../../components/NewDrop/NewDrop';

import styles from './Landing.scss';

export function Landing() {
  const params = new URLSearchParams(window.location.search);
  const weAreLive =
    params.get('wearelive') === 'true' || params.get('wearelive') === '1';

  return (
    <div className={styles.Landing}>
      <div className={styles.brandedDropJambots}>
        {/* section #1 */}
        <Section className={styles.heroSection}>
          {weAreLive ? <NewDrop /> : <ComingSoon />}
        </Section>

        {/* section #2 */}
        <Section>
          <Grid>
            <Col end={12} className={styles.hero2Bg} />
            <Col start={14}>
              <TextBlock
                subject={copy.introducingTheJambots}
                title={copy.blockchainMusicians}
              >
                <p>{copy.musicByMusicians}</p>
              </TextBlock>
            </Col>
          </Grid>
        </Section>

        {/* section #3 */}
        <Section>
          <Grid>
            <Col end={10}>
              <TextBlock
                subject={copy.uniqueAndIndividual}
                title={copy.jambotTraits}
              >
                <h4>{copy.personalTraits}</h4>
                <p>{copy.jambotTraitsDescription}</p>
                <h4>{copy.audioTraits}</h4>
                <p>{copy.audioTraitsDescription}</p>
              </TextBlock>
            </Col>
            <Col start={14} className={styles.traitsBg} />
          </Grid>
        </Section>
      </div>

      {/* section #5 */}
      <Section>
        <Grid>
          <Col end={10}>
            <TextBlock
              title={copy.whatsUSM}
            >
              <p>{copy.theUSMPlatform}</p>
              <p>{copy.ourMission}</p>
              <p>{copy.musicalDeconstruction}</p>
            </TextBlock>
          </Col>
          <Col start={12}>
            <Image src={logo} className={styles.logo} />
          </Col>
        </Grid>
      </Section>

      <Section>
        <Grid>
          <Col>
            <h2>{copy.road_crew}</h2>
            <div className={styles.roadcrew}>
              {team.map((member) => (
                <div>
                  <h4 className={styles.crewLink}><Link to={`${urls.twitter}/${member.twitter}`}>@{member.twitter}</Link></h4>
                  <div>{member.blurb}</div>
                </div>
              ))}
            </div>
          </Col>
        </Grid>
      </Section>

      <Section>
        <Grid>
          <Col>
            <h2>{copy.frequently_asked_questions}</h2>
            {faq.map((t, i) => (
              <div key={i} className={styles.faq}>
                <Accordian term={t.q} details={t.a} />
              </div>
            ))}
          </Col>
        </Grid>
      </Section>
    </div>
  );
}

export default Landing;
