import styles from './styles.module.scss'

type PriceFieldProps = {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
}

export function PriceField({ label, value, onChange, step = 0.01 }: PriceFieldProps) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        step={step}
        className={styles.fieldInput}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
      />
    </div>
  )
}
