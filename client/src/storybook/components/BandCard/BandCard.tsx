import React from 'react';

import { Pillbox } from '../../components';
import InlineList from '../InlineList/InlineList';
import { Avatar } from '../Avatar/Avatar';

import styles from './BandCard.scss';

export interface IBandCardProps {
  name: string;
  isRelativeToArtist?: boolean;
  members?: string[];
  traits?: Record<string, string>[];
  ctaButton: JSX.Element;
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

    const avatars = members.map((member: string, i) => {
      return this.genAvatar(i, member);
    });

    return (
      <div className={styles.members}>
        <InlineList items={avatars.slice(0, 5)} />
      </div>
    );
  };

  renderTrait({ name, value }: Record<string, string>): JSX.Element {
    return (
      <li key={name} className={styles.trait}>
        <div className={styles.traitName}>{name}</div>
        <div className={styles.traitValue}>{value}</div>
      </li>
    );
  }

  genAvatar(key: number, imagePath: string): JSX.Element {
    return <Avatar size='small' key={key} src={imagePath} />;
  }

  render(): JSX.Element {
    const { name, ctaButton, traits } = this.props;
    const pillBoxProps = {
      subHeader: name,
      cta: ctaButton
    };

    return (
      <Pillbox {...pillBoxProps}>
        {this.renderBandMembers()}
        {traits && (
          <ul className={styles.traits}>
            {traits.map((trait) => this.renderTrait(trait))}
          </ul>
        )}
      </Pillbox>
    );
  }
}

export default BandCard;
