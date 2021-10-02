import React from 'react';
import { connect } from 'react-redux';

import CreateArtistButton from '../../components/Buttons/CreateArtistButton/CreateArtistButton';
import {
  Accordian,
  ArtistCard,
  Button,
  Hero,
  Pillbox,
  ScrollBlock,
  TextBlock
} from '@uiComponents';
import { ITextBlockProps, ITraitsDefinition } from '@uiTypes';
import { FullLayout } from '@layouts';
import Copy from '@copy';

import LandingCopy from './Landing.copy';

import { IRootState } from '@store/types';

import core from '@store/core';
import web3 from '@store/web3';
import usm from '@store/usm';

import styles from './Landing.scss';
import copy from '@copy';

export interface ILandingProps {
  activeArtistName: string;
  activeArtistTraits: ITraitsDefinition;
  ownsAnArtist: boolean;
  ownsABand: boolean;
  totalArtists: number;
  totalArtistsMinted: number;
}

export class Landing extends React.Component<ILandingProps> {
  renderIntroTextBlock = (): JSX.Element => {
    const { totalArtistsMinted, totalArtists } = this.props;

    const props: ITextBlockProps = {
      title: Copy.ultra_sound_music,
      subject: Copy.limited_unique_nfts,
      dataPoint: `${totalArtistsMinted}/${totalArtists}`,
      callout: Copy.launching,
      ctaButton: <CreateArtistButton />
    };

    return <TextBlock {...props}>{LandingCopy.intro}</TextBlock>;
  };

  renderNewIntro(): JSX.Element {
    return (
      <>
        <div className={styles.intro_text}>{this.renderIntroTextBlock()}</div>
        <div className={styles.intro_hero}>
          <Hero src='' size='stretch' />
        </div>
      </>
    );
  }

  renderOwnerIntro(): JSX.Element {
    return (
      <>
        <div className={styles.artist_hero}>
          <Hero src='' size='stretch' />
        </div>
        <div className={styles.artist_card}>
          <ArtistCard
            name={this.props.activeArtistName}
            traits={this.props.activeArtistTraits}
            doShowExternalLink={true}
            ctaButton={<Button type='secondary'>Play artist</Button>}
          />
        </div>
        <div className={styles.find_band}>
          <Pillbox
            header={copy.slap_that_base}
            cta={<Button to='/bands'>Find a band</Button>}
          >
            {copy.join_band_with_artist}
          </Pillbox>
        </div>
        <div className={styles.band_hero}>
          <Hero src='' size='stretch' />
        </div>
        <div className={styles.mint_track}>
          <Pillbox
            header={copy.join_band_to_mint_tracks}
            isMuted={true}
            cta={<Button to='/bands'>Mint a track</Button>}
          >
            {copy.unlocked_when_join_band}
          </Pillbox>
        </div>
      </>
    );
  }

  renderMintArtistTextBlock = (): JSX.Element => {
    const props: ITextBlockProps = {
      title: Copy.ultra_sound_music,
      subject: Copy.limited_unique_nfts,
      callout: Copy.launching,
      isMuted: this.props.ownsAnArtist
    };

    return <TextBlock {...props}>{LandingCopy.step_mint_artist}</TextBlock>;
  };

  renderMintBandTextBlock = (): JSX.Element => {
    const props: ITextBlockProps = {
      title: Copy.ultra_sound_music,
      subject: Copy.limited_unique_nfts,
      callout: Copy.launching,
      isMuted: this.props.ownsABand
    };

    return <TextBlock {...props}>{LandingCopy.step_mint_artist}</TextBlock>;
  };

  renderMintTrackTextBlock = (): JSX.Element => {
    const props: ITextBlockProps = {
      title: Copy.ultra_sound_music,
      subject: Copy.limited_unique_nfts,
      callout: Copy.launching
    };

    return <TextBlock {...props}>{LandingCopy.step_mint_artist}</TextBlock>;
  };

  render(): JSX.Element {
    const { ownsAnArtist } = this.props;

    return (
      <div className={styles.Landing}>
        <FullLayout>
          <>
            {ownsAnArtist ? this.renderOwnerIntro() : this.renderNewIntro()}

            <div className={styles.onboarding_scroller}>
              <ScrollBlock>
                <div data-isMuted={this.props.ownsAnArtist}>
                  <div>
                    <Hero src='' size='stretch' />
                  </div>
                  <div>{this.renderMintArtistTextBlock()}</div>
                </div>
                <div data-isMuted={this.props.ownsABand}>
                  <div>
                    <Hero src='' size='stretch' />
                  </div>
                  <div>{this.renderMintBandTextBlock()}</div>
                </div>
                <div>
                  <div>
                    <Hero src='' size='stretch' />
                  </div>
                  <div>{this.renderMintTrackTextBlock()}</div>
                </div>
              </ScrollBlock>
            </div>
            <div className={styles.faq_section}>
              <Accordian
                term='What’s this all about?'
                details={LandingCopy.faq}
              />
              <Accordian
                term='What’s this all about?'
                details={LandingCopy.faq}
              />
              <Accordian
                term='What’s this all about?'
                details={LandingCopy.faq}
              />
              <Accordian
                term='What’s this all about?'
                details={LandingCopy.faq}
              />
              <Accordian
                term='What’s this all about?'
                details={LandingCopy.faq}
              />
              <Accordian
                term='What’s this all about?'
                details={LandingCopy.faq}
              />
            </div>
          </>
        </FullLayout>
      </div>
    );
  }
}

export function mapState(state: IRootState): ILandingProps {
  return {
    ownsAnArtist: core.selectors.ownsAnArtist(state),
    ownsABand: core.selectors.ownsABand(state),
    activeArtistName: usm.selectors.getActiveArtistName(state),
    activeArtistTraits: usm.selectors.getActiveArtistTraits(state),
    totalArtists: 999, // @TODO
    totalArtistsMinted: 999 // @TODO
  };
}

export const mapDispatch = {
  connect: web3.actions.connectWallet
};

export default connect(mapState, mapDispatch)(Landing);
