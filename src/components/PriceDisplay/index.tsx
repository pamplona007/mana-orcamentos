import styles from './styles.module.scss'

type Size = 'sm' | 'md' | 'hero'
type Variant = 'cream' | 'wine'

type PriceDisplayProps = {
  value: number
  size?: Size
  variant?: Variant
  className?: string
  ariaLabel?: string
}

function split(value: number): { inteiro: string; centavos: string } {
  const fixed = Math.abs(value).toFixed(2)
  const [inteiro, centavos = '00'] = fixed.split('.')
  const formatted = Number(inteiro).toLocaleString('pt-BR')
  return { inteiro: formatted, centavos }
}

export function PriceDisplay({
  value,
  size = 'md',
  variant = 'cream',
  className,
  ariaLabel,
}: PriceDisplayProps) {
  const { inteiro, centavos } = split(value)
  const wrapClass = [
    styles['wrap'],
    styles[size],
    variant === 'wine' ? styles['wine'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={wrapClass} aria-label={ariaLabel ?? `R$ ${value.toFixed(2)}`}>
      <span className={styles['cifrao']}>R$</span>
      <span className={styles['inteiro']}>{inteiro}</span>
      <span className={styles['centavos']}>,{centavos}</span>
    </span>
  )
}
