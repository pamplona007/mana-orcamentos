import { useOrcamento } from '@/hooks/useOrcamento'
import { AddonToggle } from '@/components/AddonToggle'
import { EditorField } from '@/components/EditorField'
import { OPCIONAIS } from '@/services/planos'
import styles from './styles.module.scss'

export function EditorDeslocamento() {
  const { state, setDeslocamento } = useOrcamento()

  return (
    <div className={styles.block}>
      <AddonToggle
        label={OPCIONAIS.deslocamento.label}
        descricao={OPCIONAIS.deslocamento.descricao}
        valor={OPCIONAIS.deslocamento.valor}
        checked={state.deslocamento.ativo}
        onChange={(ativo) => setDeslocamento({ ativo })}
      />
      {state.deslocamento.ativo && (
        <EditorField id="deslocamento-valor" label="Valor do deslocamento (R$)">
          <input
            id="deslocamento-valor"
            type="number"
            min={0}
            step={1}
            value={state.deslocamento.valor}
            onChange={(e) => setDeslocamento({ valor: Math.max(0, Number(e.target.value) || 0) })}
          />
        </EditorField>
      )}
    </div>
  )
}
