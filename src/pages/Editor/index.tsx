import { EditorSection } from '@/components/EditorSection'
import { EditorCliente } from '@/components/EditorCliente'
import { EditorEvento } from '@/components/EditorEvento'
import { EditorConvidados } from '@/components/EditorConvidados'
import { EditorDeslocamento } from '@/components/EditorDeslocamento'
import { EditorDesconto } from '@/components/EditorDesconto'
import styles from './styles.module.scss'

export function Editor() {
  return (
    <div className={styles.editor}>
      <div className={styles.main}>
        <EditorSection title="Cliente e evento" ariaLabel="Dados do cliente">
          <div className={styles.fieldGrid}>
            <EditorCliente />
            <EditorEvento />
          </div>
        </EditorSection>

        <EditorSection title="Convidados" ariaLabel="Convidados">
          <EditorConvidados />
        </EditorSection>

        <EditorSection title="Deslocamento" ariaLabel="Deslocamento">
          <EditorDeslocamento />
        </EditorSection>

        <EditorSection title="Desconto" ariaLabel="Desconto">
          <EditorDesconto />
        </EditorSection>
      </div>
    </div>
  )
}
