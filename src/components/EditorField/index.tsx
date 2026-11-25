import type { ReactNode } from 'react'
import styles from './styles.module.scss'

type EditorFieldProps = {
  id: string
  label: string
  full?: boolean
  error?: string
  children: ReactNode
}

export function EditorField({ id, label, full = false, error, children }: EditorFieldProps) {
  return (
    <div className={full ? `${styles.field} ${styles.fieldFull}` : styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label}
      </label>
      {children}
      {error && (
        <span className={styles.fieldError} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
