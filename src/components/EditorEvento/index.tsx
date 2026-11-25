import { useOrcamento } from '@/hooks/useOrcamento'
import { EditorField } from '@/components/EditorField'
import styles from './styles.module.scss'

export function EditorEvento() {
  const { state, setEvento } = useOrcamento()

  return (
    <div className={styles.block}>
      <EditorField id="evento-data" label="Data do evento">
        <input
          id="evento-data"
          type="date"
          value={state.evento.data}
          onChange={(e) => setEvento({ data: e.target.value })}
        />
      </EditorField>
      <EditorField id="evento-local" label="Cidade e bairro">
        <input
          id="evento-local"
          value={state.evento.cidadeBairro}
          onChange={(e) => setEvento({ cidadeBairro: e.target.value })}
          placeholder="Ex: Fortaleza, Aldeota"
        />
      </EditorField>
      <EditorField id="evento-obs" label="Observações" full>
        <textarea
          id="evento-obs"
          value={state.evento.observacoes}
          onChange={(e) => setEvento({ observacoes: e.target.value })}
          placeholder="Ex: 2 vegetarianos, restrição a lactose, levar pimentas frescas"
          rows={3}
        />
      </EditorField>
    </div>
  )
}
