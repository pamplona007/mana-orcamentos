import { IconSearch } from '@tabler/icons-react'
import styles from './styles.module.scss'

type HistoryHeaderProps = {
  total: number
  busca: string
  onBuscaChange: (busca: string) => void
}

export function HistoryHeader({ total, busca, onBuscaChange }: HistoryHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <span className={styles.eyebrow}>Histórico</span>
        <h1 className={styles.title}>
          {total} {total === 1 ? 'orçamento salvo' : 'orçamentos salvos'}
        </h1>
      </div>
      <label className={styles.search}>
        <IconSearch size={16} aria-hidden="true" />
        <input
          type="search"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder="Buscar por cliente"
          aria-label="Buscar por cliente"
        />
      </label>
    </header>
  )
}
