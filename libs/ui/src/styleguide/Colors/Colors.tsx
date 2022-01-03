import { useState, RefObject } from 'react';
import cn from 'clsx';

import { rgba2hex } from '../../utils';
import styles from './Colors.scss';

interface IColorProps {
  color: string
}

interface IGradientProps {
  gradient: string
}

interface IColorsProps {
  colors: string[],
  gradients: string[]
}

function getBgColor(el: HTMLDivElement): string {
  const css = window.getComputedStyle(el);
  const bgColor = css.getPropertyValue('background-color');
  return rgba2hex(bgColor);
}

function getBgGradientColors(el: HTMLDivElement): string {
  const css = window.getComputedStyle(el);
  const bgImage = css.getPropertyValue('background-image');
  if (!bgImage || typeof bgImage !== 'string') {
    return '';
  }

  const iterator = bgImage.matchAll(/rgb\((.*?)\)/g);
  const matches = Array.from(iterator);
  if (!matches.length) {
    return '';
  }

  return matches.map((match) => rgba2hex(match[0])).join(', ');
}

function Color({ color }: IColorProps) {
  const [value, setValue] = useState('');
  const className = cn(styles.item, styles.Color);
  const swatchClassName = cn(styles.swatch, styles[color]);

  function parseRef(el: HTMLDivElement) {
    if (el) {
      setValue(getBgColor(el));
    }
  }

  return (
    <div className={className}>
      <div className={swatchClassName} ref={parseRef}></div>
      <div className={styles.value}>{value}</div>
      <div className={styles.name}>{color}</div>
    </div>
  )
}

function Gradient({ gradient }: IGradientProps) {
  const [value, setValue] = useState('');
  const className = cn(styles.item, styles.Gradient);
  const swatchClassName = cn(styles.swatch, styles[`gradient-${gradient}`]);

  function parseRef(el: HTMLDivElement) {
    if (el) {
      setValue(getBgGradientColors(el));
    }
  }

  return (
    <div className={className}>
      <div className={swatchClassName} ref={parseRef}></div>
      <div className={styles.value}>{value}</div>
      <div className={styles.name}>{gradient}</div>
    </div>
  )
}

export function Colors({ colors, gradients }: IColorsProps) {
  return (
    <div>
      <div className={styles.title}>Colors</div>
      <div className={styles.colors}>{colors.map((color) => <Color key={color} color={color} />)}</div>
      <div className={styles.title}>Gradients</div>
      <div className={styles.colors}>{gradients.map((gradient) => <Gradient key={gradient} gradient={gradient} />)}</div>
    </div>
  )
}

export default Colors;