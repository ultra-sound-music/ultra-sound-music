import React from 'react';
import cn from 'classnames';

import styles from './Pillbox.scss';
export interface IPillboxProps {
  image?: JSX.Element;
  subject?: React.ReactNode;
  header?: React.ReactNode;
  subHeader?: React.ReactNode;
  isMuted?: boolean;
  withPadding?: boolean;
  withBackground?: boolean;
  secondaryCta?: JSX.Element;
  cta?: JSX.Element;
  children?: React.ReactNode;
}

export class Pillbox extends React.Component<IPillboxProps> {
  static defaultProps = {
    withPadding: true,
    withBackground: true
  };

  renderImage = (): JSX.Element => {
    if (!this.props.image) {
      return;
    }

    return <div className={styles.image}>{this.props.image}</div>;
  };

  renderHeaders = (): JSX.Element => {
    const { subject, header, subHeader } = this.props;
    if (!(subject || header || subHeader)) {
      return;
    }

    return (
      <div className={styles.headers}>
        {subject && <div className={styles.subject}>{subject}</div>}
        {header && <div className={styles.header}>{header}</div>}
        {subHeader && <div className={styles.subHeader}>{subHeader}</div>}
      </div>
    );
  };

  renderCtas = (): JSX.Element => {
    const { cta, secondaryCta, isMuted } = this.props;

    if (!(cta || secondaryCta)) {
      return;
    }

    let ctaButton: React.ReactNode;
    if (isMuted && cta) {
      ctaButton = React.cloneElement(cta, { isDisabled: true });
    } else {
      ctaButton = cta;
    }

    let secondaryCtaButton: React.ReactNode;
    if (isMuted && secondaryCta) {
      secondaryCtaButton = React.cloneElement(secondaryCta, {
        isDisabled: true
      });
    } else {
      secondaryCtaButton = secondaryCta;
    }

    return (
      <div className={styles.buttons}>
        {secondaryCtaButton && secondaryCtaButton}
        {ctaButton && ctaButton}
      </div>
    );
  };

  render(): JSX.Element {
    const { withPadding, withBackground, isMuted, children } = this.props;

    const classNames = cn(
      styles.Pillbox,
      { [styles.padded]: withPadding },
      { [styles.muted]: isMuted },
      { [styles.withBackground]: withBackground }
    );

    return (
      <div className={classNames}>
        {this.renderImage()}
        {this.renderHeaders()}
        <div className={styles.content}>{children}</div>
        {this.renderCtas()}
      </div>
    );
  }
}

export default Pillbox;
