import { Link } from 'react-router-dom'
import styles from './styles.module.scss'

export function HistoryEmpty() {
  return (
    <div className={styles.empty}>
      <h1 className={styles.emptyTitle}>Histórico vazio</h1>
      <p className={styles.emptyText}>
        Orçamentos salvos aparecem aqui. Vá para a aba <strong>Preview</strong> e clique em{' '}
        <strong>Salvar</strong> para arquivar o orçamento atual.
      </p>
      <Link to="/preview" className={styles.emptyLink}>
        Ir para o Preview
      </Link>
    </div>
  )
}
