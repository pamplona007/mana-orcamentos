import { PDFViewer } from '@react-pdf/renderer'
import type { Orcamento, TotaisPorPlano } from '@/types/orcamento'
import type { Config } from '@/types/config'
import { OrcamentoPDF } from '@/pdf/OrcamentoPDF'
import styles from './styles.module.scss'

type PreviewPdfViewerProps = {
  orcamento: Orcamento
  totais: TotaisPorPlano
  validadeISO: string
  config: Config
}

export function PreviewPdfViewer({
  orcamento,
  totais,
  validadeISO,
  config,
}: PreviewPdfViewerProps) {
  return (
    <section className={styles.cardWide}>
      <span className={styles.cardEyebrow}>Pré-visualização do PDF</span>
      <PDFViewer style={{ width: '100%', height: '70vh', border: 'none' }} showToolbar={false}>
        <OrcamentoPDF
          orcamento={orcamento}
          totais={totais}
          validadeISO={validadeISO}
          config={config}
        />
      </PDFViewer>
    </section>
  )
}
