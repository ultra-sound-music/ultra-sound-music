import clsx from 'clsx';

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

function Color({ color }: IColorProps) {
  const colorBoxStyles = clsx(styles.colorBox)

  return (
    <div className={styles.Color}>
      <div className={colorBoxStyles}></div>
      <div className={styles.colorName}>{color}</div>
    </div>
  )
}

function Gradient({ gradient }: IGradientProps) {
  const colorBoxStyles = clsx(styles.colorBox)

  return (
    <div className={styles.Color}>
      <div className={colorBoxStyles}></div>
      <div className={styles.colorName}>{gradient}</div>
    </div>
  )
}

export function Colors({ colors, gradients }: IColorsProps) {
  return (
    <div>
      <div>Colors</div>
      <div>{colors.map((color) => <Color key={color} color={color} />)}</div>
      <div>Gradients</div>
      <div>{gradients.map((gradient) => <Gradient key={gradient} gradient={gradient} />)}</div>
    </div>
  )
}

export default Colors;