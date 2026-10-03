import { IconMinus, IconPlus } from '@tabler/icons-react'
import styles from './styles.module.scss'

type NumberStepperProps = {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  step?: number
  size?: 'md' | 'lg'
  ariaLabel: string
  disabled?: boolean
}

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  size = 'md',
  ariaLabel,
  disabled = false,
}: NumberStepperProps) {
  const canDec = !disabled && value > min
  const canInc = !disabled && value < max

  return (
    <div
      className={`${styles.stepper} ${size === 'lg' ? styles.lg : ''}`}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className={styles.btn}
        onClick={() => canDec && onChange(Math.max(min, value - step))}
        disabled={!canDec}
        aria-label={`Diminuir ${ariaLabel}`}
      >
        <IconMinus size={16} aria-hidden="true" />
      </button>
      <span className={styles.value} aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button
        type="button"
        className={styles.btn}
        onClick={() => canInc && onChange(Math.min(max, value + step))}
        disabled={!canInc}
        aria-label={`Aumentar ${ariaLabel}`}
      >
        <IconPlus size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
