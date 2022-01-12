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
      <Section className={styles.heroSection}>
        {weAreLive ? <NewDrop /> : <ComingSoon />}
      </Section>

      <Section>
        <Grid>
          <Col start={1} end={12} className={styles.hero2Bg} />
          <Col start={13} end='end'>
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
        <Container>
          <div></div>
          <TextBlock
            subject={copy.genesisCollection}
            title={copy.uniqueJambots}
          >
            <h4>{copy.lipsum_3w}</h4>
            {copy.lipsum_1p}
          </TextBlock>
        </Container>
      </Section>

      <Section>
        <Grid>
          <Col start={1} end={11}>
            <div></div>
            <TextBlock
              subject={copy.genesisCollection}
              title={copy.uniqueJambots}
            >
              {copy.lipsum_2p}
            </TextBlock>
          </Col>
          <Col start={12} end='end'>
            <div>
              <Image src={logo} className={styles.logo} />
            </div>
          </Col>
        </Grid>
      </Section>

      <Section>
        <Container>
          <h2>Road Crew</h2>
          <div className={styles.roadcrew}>
            {team.map((member) => (
              <Figure
                key={member.twitter}
                image={<Image src={anonAvatar} />}
                title={
                  <Link to={`${urls.twitter}/${member.twitter}`}>
                    @{member.twitter}
                  </Link>
                }
                caption={`${member.blurb}`}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          {faq.map((t, i) => (
            <div key={i} className={styles.faq}>
              <Accordian term={t.q} details={t.a} />
            </div>
          ))}
        </Container>
      </Section>
    </div>
  );
}

export default Landing;
