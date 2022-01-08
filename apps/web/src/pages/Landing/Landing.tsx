import { Accordian, Callout, TextBlock, CollectionStamp, Section } from '@usm/ui';
import copy from '@usm/copy';

import styles from './Landing.scss';

/* eslint-disable-next-line */
export interface HomeProps {}

export function Home(props: HomeProps) {
  return (
    <div className={styles.Landing}>
      <Section>
        <div>
          <CollectionStamp />
          <Callout />
          <p>Nlab Nlab Nlab</p>
        </div>
      </Section>

      <Section>
        <div>
          
        </div>
        <TextBlock 
          subject={copy.genesisCollection}
          title={copy.uniqueJambots}
        >
          {copy.describeJambots}
        </TextBlock>
      </Section>

      <Section>
        <div>
          
        </div>
        <TextBlock 
          subject={copy.genesisCollection}
          title={copy.uniqueJambots}
        >
          {copy.describeJambots}
        </TextBlock>
      </Section>
      
      <Section>
        <div>
          
        </div>
        <TextBlock 
          subject={copy.genesisCollection}
          title={copy.uniqueJambots}
        >
          {copy.describeJambots}
        </TextBlock>
      </Section>

      <Section>
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
      </Section> 
    </div>
  );
}

export default Home;
