import React from 'react';
import { connect } from 'react-redux';

import {
  Accordian,
  ArtistCard,
  Button,
  Hero,
  Section,
  TextBlock
} from '@uiComponents';
import { ITextBlockProps } from '@uiTypes';
import copy from '@copy';

import landingCopy from '../Landing/Landing.copy';

import { IRootState } from '@store/types';
import web3 from '@store/web3';
import configs from '@store/configs';

import styles from './LandingArtistOnly.scss';

export interface ILandingProps {
  lfg: boolean;
}

export class Landing extends React.Component<ILandingProps> {
  renderIntroTextBlock = (): JSX.Element => {
    const props: ITextBlockProps = {
      title: copy.ultra_sound_music,
      subject: copy.limited_unique_nfts,
      callout: copy.launching
    };

    return <TextBlock {...props}>{landingCopy.intro}</TextBlock>;
  };

  renderArtistMint = (): JSX.Element => {
    return (
      <>
        <div className={styles.token_mint}>
          <ArtistCard
            name='Dagoberto'
            traits={[1, 2, 3, 4].map((n) => ({
              name: `Trait ${n}`,
              value: `${n}${n}${n}`
            }))}
            ctaButton={<Button type='primary'>Mint</Button>}
          />
        </div>
        <div className={styles.mint_hero}>
          <Hero src='' size='stretch' />
        </div>
      </>
    );
  };

  renderPendingIntro = (): JSX.Element => {
    return (
      <>
        <div className={styles.pending_intro_text}>
          {this.renderIntroTextBlock()}
        </div>
        <div className={styles.pending_intro_hero}>
          <Hero src='' size='stretch' />
        </div>
      </>
    );
  };

  renderLFGIntro = (): JSX.Element => {
    return (
      <>
        <div className={styles.lfg_intro_hero}>
          <Hero src='' size='stretch' />
        </div>
        <div className={styles.lfg_intro_text}>
          {this.renderIntroTextBlock()}
        </div>
      </>
    );
  };

  renderArtistPreview = (): JSX.Element => {
    return (
      <>
        <div className={styles.preview_artist_features}>
          <TextBlock subject='artist features' title='Attributes &amp; Sounds'>
            {copy.lorem}
          </TextBlock>
        </div>
        <div className={styles.preview_artist_hero}>
          <Hero src='' size='stretch' />
        </div>
        <div className={styles.preview_artist_card}>
          <ArtistCard
            name='Dagoberto'
            traits={[1, 2, 3, 4].map((n) => ({
              name: `Trait ${n}`,
              value: `${n}${n}${n}`
            }))}
          />
        </div>
      </>
    );
  };

  renderRoadmap = (): JSX.Element => {
    return (
      <>
        <div className={styles.roadmap_item}>
          <TextBlock subject='01 - Launch' legend='testing 1'></TextBlock>
        </div>
        <div className={styles.roadmap_item}>
          <TextBlock subject='02 - Launch' legend='testing 1'></TextBlock>
        </div>
        <div className={styles.roadmap_item}>
          <TextBlock subject='03 - Launch' legend='testing 1'></TextBlock>
        </div>
      </>
    );
  };

  renderFaqs = (): JSX.Element => {
    return (
      <>
        <div className={styles.faq_item}>
          <Accordian term='What’s this all about?' details={landingCopy.faq} />
        </div>
        <div className={styles.faq_item}>
          <Accordian term='What’s this all about?' details={landingCopy.faq} />
        </div>
        <div className={styles.faq_item}>
          <Accordian term='What’s this all about?' details={landingCopy.faq} />
        </div>
        <div className={styles.faq_item}>
          <Accordian term='What’s this all about?' details={landingCopy.faq} />
        </div>
        <div className={styles.faq_item}>
          <Accordian term='What’s this all about?' details={landingCopy.faq} />
        </div>
        <div className={styles.faq_item}>
          <Accordian term='What’s this all about?' details={landingCopy.faq} />
        </div>
      </>
    );
  };

  render(): JSX.Element {
    const { lfg } = this.props;

    return (
      <div className={styles.LandingArtistOnly}>
        {lfg && <Section spacing='bottom'>{this.renderArtistMint()}</Section>}

        {lfg && (
          <Section spacing={true}>
            {lfg ? this.renderLFGIntro() : this.renderPendingIntro()}
          </Section>
        )}

        {!lfg && (
          <Section spacing='bottom'>
            {lfg ? this.renderLFGIntro() : this.renderPendingIntro()}
          </Section>
        )}

        <Section isAlt={true} spacing={true}>
          {this.renderArtistPreview()}
        </Section>

        <Section header='road map' spacing={true}>
          {this.renderRoadmap()}
        </Section>

        <Section header='faq'>{this.renderFaqs()}</Section>
      </div>
    );
  }
}

export function mapState(state: IRootState): ILandingProps {
  return {
    lfg: configs.selectors.getLfg(state)
  };
}

export const mapDispatch = {
  connect: web3.actions.connectWallet
};

export default connect(mapState, mapDispatch)(Landing);
