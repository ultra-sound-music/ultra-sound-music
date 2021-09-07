import React from 'react';
import cn from 'classnames';

import Button, { EButtonSize, EButtonStyle } from '../Button/Button';
import Copy from '../../copy/copy';

import styles from './Pillbox.scss';

export enum EPillboxSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export enum EPillboxStyle {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface IPillboxProps {
  header?: string;
  subheader?: string;
  ctaText?: string;
  ctaOnClick?: () => void;
  children: JSX.Element | JSX.Element[];
}

export class Pillbox extends React.Component<IPillboxProps> {
  getNumSections = (): number => {
    const { header, subheader, ctaOnClick } = this.props;

    let numSections = 1;
    if (header || subheader) numSections++;
    if (ctaOnClick) numSections++;
    return numSections;
  };

  renderHeader = (): JSX.Element => {
    const { header } = this.props;

    if (!header) {
      return;
    }

    return <div className={styles.header}>{header}</div>;
  };

  renderSubheader = (): JSX.Element => {
    const { subheader } = this.props;

    if (!subheader) {
      return;
    }

    return <div className={styles.subheader}>{subheader}</div>;
  };

  renderHeaders = (): JSX.Element => {
    const header = this.renderHeader();
    let subheader;
    if (header) {
      subheader = this.renderSubheader();
    }

    return (
      <div className={styles.headers}>
        {header}
        {subheader}
      </div>
    );
  };

  ctaOnClick = (): void => {
    if (!this.props.ctaOnClick) {
      return;
    }

    this.props.ctaOnClick();
  };

  renderCta = (): JSX.Element => {
    const { ctaText = Copy.submit, ctaOnClick } = this.props;

    if (!ctaOnClick) {
      return;
    }

    return (
      <div className={styles.button}>
        <Button
          onClick={this.ctaOnClick}
          text={ctaText}
          size={EButtonSize.LARGE}
          style={EButtonStyle.LIGHT}
          isFullWidth={true}
        />
      </div>
    );
  };

  render(): JSX.Element {
    const { children } = this.props;

    const numSections = this.getNumSections();
    const classNames = cn(styles.Pillbox, styles[`sections-${numSections}`]);

    return (
      <div className={classNames}>
        {this.renderHeaders()}
        <div className={styles.content}>{children}</div>
        {this.renderCta()}
      </div>
    );
  }
}

export default Pillbox;
