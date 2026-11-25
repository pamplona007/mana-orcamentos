import type { ReactNode } from 'react'
import styles from './styles.module.scss'

type EditorSectionProps = {
  title: string
  ariaLabel: string
  children: ReactNode
}

export function EditorSection({ title, ariaLabel, children }: EditorSectionProps) {
  return (
    <section className={styles.section} aria-label={ariaLabel}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      {children}
    </section>
  )
}
