import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import PillBox from '../Pillbox/Pillbox';
import InlineList, { ERowGap } from '../InlineList/InlineList';
import { Avatar } from '../Avatar/Avatar';

import styles from './BandCard.scss';

export interface IBandCardProps extends RouteComponentProps {
  name: string;
  members?: JSX.Element[] | string[];
  traits?: JSX.Element[] | string[];
  href: string;
}

export class BandCard extends React.Component<IBandCardProps> {
  renderBandMember = (
    bandMemberAvatar: typeof Avatar,
    key: number
  ): JSX.Element => {
    return (
      <li key={key} className={styles.member}>
        {bandMemberAvatar}
      </li>
    );
  };

  renderBandMembers = (): JSX.Element => {
    const { members } = this.props;

    if (!members?.length) {
      return;
    }

    return (
      <div className={styles.members}>
        <InlineList items={members} />
      </div>
    );
  };

  renderTraits = (): JSX.Element => {
    const { traits } = this.props;

    if (!traits?.length) {
      return;
    }

    return (
      <div className={styles.traits}>
        <InlineList items={traits.slice(0, 4)} rowGap={ERowGap.TIGHT} />
      </div>
    );
  };

  onClick = (): void => {
    const { href } = this.props;

    if (!href) {
      return;
    }

    this.props.history.push(this.props.href);
  };

  render(): JSX.Element {
    const { name } = this.props;

    return (
      <PillBox header={name} ctaOnClick={this.onClick}>
        {this.renderBandMembers()}
        {this.renderTraits()}
      </PillBox>
    );
  }
}

export default BandCard;
