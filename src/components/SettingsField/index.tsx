import type { ReactNode } from 'react'
import styles from './styles.module.scss'

type SettingsFieldProps = {
  id: string
  label?: string
  full?: boolean
  error?: string
  children: ReactNode
}

export function SettingsField({
  id,
  label,
  full = false,
  error,
  children,
}: SettingsFieldProps) {
  return (
    <div className={full ? `${styles.field} ${styles.fieldFull}` : styles.field}>
      {label && (
        <label className={styles.fieldLabel} htmlFor={id}>
          {label}
        </label>
      )}
      {children}
      {error && (
        <span className={styles.fieldError} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
