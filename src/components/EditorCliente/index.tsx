import { useOrcamento } from '@/hooks/useOrcamento'
import { EditorField } from '@/components/EditorField'
import styles from './styles.module.scss'

export function EditorCliente() {
  const { state, setCliente } = useOrcamento()

  return (
    <div className={styles.block}>
      <EditorField id="cliente-nome" label="Nome do cliente">
        <input
          id="cliente-nome"
          value={state.cliente.nome}
          onChange={(e) => setCliente({ ...state.cliente, nome: e.target.value })}
          placeholder="Ex: Maria Silva"
        />
      </EditorField>
      <EditorField id="cliente-whats" label="WhatsApp">
        <input
          id="cliente-whats"
          value={state.cliente.whatsapp}
          onChange={(e) => setCliente({ ...state.cliente, whatsapp: e.target.value })}
          placeholder="(85) 9 9999-9999"
        />
      </EditorField>
    </div>
  )
}
