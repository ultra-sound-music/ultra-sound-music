import React from 'react';
import { connect } from 'react-redux';

import {
  Accordian,
  ArtistCard,
  Hero,
  MintArtist,
  Section,
  TextBlock,
  Carousel
} from '@uiComponents';
import { ITextBlockProps } from '@uiTypes';
import copy from '@copy';

import landingCopy from '../Landing/Landing.copy';

import { IRootState } from '@store/types';
import usm from '@store/usm';
import configs from '@store/configs';

import CreateArtistButton from '@appComponents/Buttons/CreateArtistButton/CreateArtistButton';

import styles from './LandingArtistOnly.scss';

export type TLandingArtistOnlyProps = ILandingArtistOnlyProps &
  ILandingArtistOnlyActions;

export interface ILandingArtistOnlyProps {
  lfg: boolean;
  newMints: Record<string, unknown>[];
}

export interface ILandingArtistOnlyActions {
  fetchNewMints: () => void;
}

export interface ILandingArtistOnlyState {
  currentMintOffer: number;
}

export class LandingArtistOnly extends React.Component<TLandingArtistOnlyProps> {
  state: ILandingArtistOnlyState = {
    currentMintOffer: 0
  };

  componentDidMount(): void {
    this.props.fetchNewMints();
  }

  componentDidUpdate(prevProps: ILandingArtistOnlyProps): void {
    if (
      this.props.newMints.length &&
      this.props.newMints !== prevProps.newMints
    ) {
      this.setCurrentMint(
        this.props.newMints[this.state.currentMintOffer].id as string
      );
    }
  }

  setCurrentMint = (id: string): void => {
    this.setState({
      currentMintOffer: id
    });
  };

  renderIntroTextBlock = (): JSX.Element => {
    const props: ITextBlockProps = {
      title: copy.ultra_sound_music,
      subject: copy.limited_unique_nfts,
      callout: copy.launching
    };

    return <TextBlock {...props}>{landingCopy.intro}</TextBlock>;
  };

  renderNewMint = (mint: Record<string, unknown>): JSX.Element => {
    const { name, price, id } = mint;

    return (
      <MintArtist
        key={id as string}
        name={name as string}
        price={price as number}
        ctaButton={<CreateArtistButton />}
      />
    );
  };

  onClickPrev = (index: number): void => {
    this.setCurrentMint(this.props.newMints[index].id as string);
  };

  onClickNext = (index: number): void => {
    this.setCurrentMint(this.props.newMints[index].id as string);
  };

  renderNewMints = (): JSX.Element[] => {
    return this.props.newMints.map(this.renderNewMint);
  };

  renderArtistMint = (): JSX.Element => {
    const mint = this.props.newMints.find(({ id }) => {
      return id === this.state.currentMintOffer;
    });

    return (
      <>
        <div className={styles.token_mint}>
          <Carousel
            onClickPrev={this.onClickPrev}
            onClickNext={this.onClickNext}
          >
            {this.renderNewMints()}
          </Carousel>
        </div>
        <div className={styles.mint_hero}>
          {mint && mint.artUrl && (
            <Hero src={mint.artUrl as string} size='stretch' />
          )}
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
          <Hero
            src='https://ipfs.io/ipfs/bafybeib4kfsjv5knx4d6xwdxceivwzrcbyaunp4povfn5ow55jjd7dmuhy'
            size='stretch'
          />
        </div>
      </>
    );
  };

  renderLFGIntro = (): JSX.Element => {
    return (
      <>
        <div className={styles.lfg_intro_hero}>
          <Hero
            src='https://ipfs.io/ipfs/bafybeib4kfsjv5knx4d6xwdxceivwzrcbyaunp4povfn5ow55jjd7dmuhy'
            size='stretch'
          />
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
          <TextBlock
            subject='artist features'
            subTitle='Attributes &amp; Sounds'
          >
            {copy.lorem}
          </TextBlock>
        </div>
        <div className={styles.preview_artist_hero}>
          <Hero
            src='https://ipfs.io/ipfs/bafybeidohwmeckcxb7ydrcwa6kml5bg7em6mxvusljjmaymgh4juoo3diq'
            size='stretch'
          />
        </div>
        <div className={styles.preview_artist_card}>
          <ArtistCard name='Dagoberto' />
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

export function mapState(state: IRootState): ILandingArtistOnlyProps {
  return {
    lfg: configs.selectors.getLfg(state),
    newMints: usm.selectors.getAllNewMints(state)
  };
}

export const mapActions: ILandingArtistOnlyActions = {
  fetchNewMints: usm.actions.fetchNewMints
};

export default connect(mapState, mapActions)(LandingArtistOnly);
