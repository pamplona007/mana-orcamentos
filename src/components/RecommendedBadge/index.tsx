import { IconCrown } from '@tabler/icons-react'
import styles from './styles.module.scss'

type RecommendedBadgeProps = {
  text?: string
}

export function RecommendedBadge({ text = 'Recomendado' }: RecommendedBadgeProps) {
  return (
    <span className={styles.badge} role="status" aria-label={text}>
      <IconCrown className={styles.crown} aria-hidden="true" />
      {text}
    </span>
  )
}
