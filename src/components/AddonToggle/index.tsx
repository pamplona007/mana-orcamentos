import styles from './styles.module.scss'
import { formatBRL } from '@/utils/money'

type AddonToggleProps = {
  label: string
  descricao?: string
  valor: number
  checked: boolean
  onChange: (next: boolean) => void
}

export function AddonToggle({ label, descricao, valor, checked, onChange }: AddonToggleProps) {
  return (
    <button
      type="button"
      className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label={`${label} (${formatBRL(valor)})${checked ? ' — ativado' : ''}`}
    >
      <div className={styles.info}>
        <span className={styles.label}>{label}</span>
        {descricao && <span className={styles.descricao}>{descricao}</span>}
      </div>
      <span className={styles.valor}>+ {formatBRL(valor)}</span>
      <span
        className={`${styles.switch} ${checked ? styles.switchOn : ''}`}
        aria-hidden="true"
      />
    </button>
  )
}
