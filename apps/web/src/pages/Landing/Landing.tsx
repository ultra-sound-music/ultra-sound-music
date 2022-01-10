import { Link } from 'react-router-dom';
import { Accordian, Container, Col, Figure, Grid, Image, TextBlock, CollectionStamp, Section } from '@usm/ui';
import { copy } from '@usm/content';
import logo from '@usm/images/logo.png';
import { urls, team, faq } from '@usm/content';
import anonAvatar from '@usm/images/avatar_anon.png';

import styles from './Landing.scss';

export function Landing() {
  return (
    <div className={styles.Landing}>
      <Section className={styles.heroSection}>
        <Grid>
          <Col start={2} end={11}>  
            <div className={styles.heroContainer}>
              <div className={styles.heroBg} />
              <div className={styles.stamp}><CollectionStamp /></div>
              <div>{copy.lipsum_50w}</div>
            </div>
          </Col>
        </Grid>
      </Section>

      <Section>
        <Grid>
          <Col start={13} end='end'>
            <div>
              
            </div>
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
          <div>
            
          </div>
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
            <div>
              
            </div>
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
          {faq.map((t, i) => (
            <div key={i} className={styles.faq}>
              <Accordian 
                term={t.q}
                details={t.a}
              />              
            </div>
          ))}
        </Container>
      </Section>
      <Section>
        <Container>
          <h1>Road Crew</h1>
          <div className={styles.roadcrew}>
            {team.map((member) => (
              <Figure
                key={member.twitter}
                image={<Image src={anonAvatar} />}
                title={<Link to={`${urls.twitter}/${member.twitter}`}>{member.twitter}</Link>}
                caption={`${member.blurb}`}
              />              
            ))}        
          </div>   
        </Container>
      </Section>
    </div>
  );
}

export default Landing;
