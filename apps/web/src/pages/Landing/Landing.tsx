import { Link } from 'react-router-dom';
import { Accordian, Container, Col, Figure, Grid, Image, TextBlock, CollectionStamp, Section } from '@usm/ui';
import copy from '@usm/copy';
import anonAvatar from '@usm/images/avatar_anon.png';

import styles from './Landing.scss';

export function Landing() {
  return (
    <div className={styles.Landing}>
      <Section className={styles.heroSection}>
        <Grid>
          <Col start={1} end={11}>
            <CollectionStamp />
            <p>{copy.lipsum_50w}</p>
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
            {copy.describeJambots}
          </TextBlock>          
        </Container>
      </Section>

      <Section>
        <Container>
          <div>
            
          </div>
          <TextBlock 
            subject={copy.genesisCollection}
            title={copy.uniqueJambots}
          >
            {copy.describeJambots}
          </TextBlock>          
        </Container>
      </Section>
      
      <Section>
        <Container>
          <div>
            
          </div>
          <TextBlock 
            subject={copy.genesisCollection}
            title={copy.uniqueJambots}
          >
            {copy.describeJambots}
          </TextBlock>          
        </Container>
      </Section>

      <Section>
        <Container>
          <Accordian 
            term={copy.what}
            details={copy.what}
          />
          <Accordian 
            term={copy.what}
            details={copy.what}
          />
          <Accordian 
            term={copy.what}
            details={copy.what}
          />
        </Container>
      </Section> 
      <Section>
        <Container>
          <h1>Road Crew</h1>
          <div className={styles.roadcrew}>
            <Figure
              image={<Image src={anonAvatar} />}
              title={<Link to={'test'}>Name</Link>}
              caption={'Badass'}
            />
            <Figure
              image={<Image src={anonAvatar} />}
              title={<Link to={'test'}>Name</Link>}
              caption={'Badass'}
            />
            <Figure
              image={<Image src={anonAvatar} />}
              title={<Link to={'test'}>Name</Link>}
              caption={'Badass'}
            />
            <Figure
              image={<Image src={anonAvatar} />}
              title={<Link to={'test'}>Name</Link>}
              caption={'Badass'}
            />            
          </div>   
        </Container>
      </Section>
    </div>
  );
}

export default Landing;
