import styles from './styles.module.scss'

type SettingsCheckboxProps = {
  id: string
  label: string
  text: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SettingsCheckbox({ id, label, text, checked, onChange }: SettingsCheckboxProps) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label}
      </label>
      <label className={styles.checkboxRow}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{text}</span>
      </label>
    </div>
  )
}
