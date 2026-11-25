import type { ReactNode } from 'react'
import styles from './styles.module.scss'

export function SettingsGrid({ children }: { children: ReactNode }) {
  return <div className={styles.grid}>{children}</div>
}
