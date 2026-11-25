import { useOrcamento } from '@/hooks/useOrcamento'
import { GuestBreakdown } from '@/components/GuestBreakdown'
import styles from './styles.module.scss'

export function EditorConvidados() {
  const { state, setConvidados } = useOrcamento()

  return (
    <div className={styles.block}>
      <GuestBreakdown value={state.convidados} onChange={setConvidados} />
    </div>
  )
}
