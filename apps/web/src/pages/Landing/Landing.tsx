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
import anonAvatar from '@usm/images/avatar_anon.png';

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
        <Section className={styles.heroSection}>
          {weAreLive ? <NewDrop /> : <ComingSoon />}
        </Section>

        <Section>
          <Grid>
            <Col end={12} className={styles.hero2Bg} />
            <Col start={14}>
              <TextBlock
                subject={copy.genesisCollection}
                title={copy.uniqueJambots}
              >
                {copy.lipsum_2p}
              </TextBlock>
            </Col>
          </Grid>
        </Section>

        <Section>
          <Grid>
            <Col end={11}>
              <TextBlock
                subject={copy.genesisCollection}
                title={copy.uniqueJambots}
              >
                <h4>{copy.lipsum_3w}</h4>
                {copy.lipsum_1p}
              </TextBlock>
            </Col>
            <Col start={14} className={styles.traitsBg} />
          </Grid>
        </Section>
      </div>

      <Section>
        <Grid>
          <Col start={1} end={11}>
            <TextBlock
              subject={copy.genesisCollection}
              title={copy.uniqueJambots}
            >
              {copy.lipsum_2p}
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
            <h2>Road Crew</h2>
            <div className={styles.roadcrew}>
              {team.map((member) => (
                <div>
                  <div className={styles.crewLink}><Link to={`${urls.twitter}/${member.twitter}`}>@{member.twitter}</Link></div>
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
