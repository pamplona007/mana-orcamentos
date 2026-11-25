import type { ReactNode } from 'react'
import styles from './styles.module.scss'

type SettingsSectionProps = {
  icon: ReactNode
  title: string
  helper?: ReactNode
  children: ReactNode
}

export function SettingsSection({ icon, title, helper, children }: SettingsSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        {icon}
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      {helper && <p className={styles.helperText}>{helper}</p>}
      {children}
    </section>
  )
}
