import type { ComponentProps } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import {
  IconDownload,
  IconBrandWhatsapp,
  IconPrinter,
  IconDeviceFloppy,
} from '@tabler/icons-react'
import styles from './styles.module.scss'

type PdfDocument = ComponentProps<typeof PDFDownloadLink>['document']

type PreviewActionsProps = {
  salvo: boolean
  onSalvar: () => void
  fileName: string
  whatsappLink: string
  documentoColor: PdfDocument
  documentoPrint: PdfDocument
}

export function PreviewActions({
  salvo,
  onSalvar,
  fileName,
  whatsappLink,
  documentoColor,
  documentoPrint,
}: PreviewActionsProps) {
  return (
    <div className={styles.actions}>
      <button
        type="button"
        onClick={onSalvar}
        className={styles.btnSave}
        aria-label="Salvar orçamento no histórico"
      >
        <IconDeviceFloppy size={16} aria-hidden="true" />
        {salvo ? 'Salvo' : 'Salvar'}
      </button>
      <PDFDownloadLink document={documentoColor} fileName={fileName} className={styles.btnDownload}>
        {({ loading }) =>
          loading ? (
            <>
              <IconDownload size={16} aria-hidden="true" />
              Gerando…
            </>
          ) : (
            <>
              <IconDownload size={16} aria-hidden="true" />
              Baixar PDF
            </>
          )
        }
      </PDFDownloadLink>
      <PDFDownloadLink
        document={documentoPrint}
        fileName={fileName.replace('.pdf', '-pb.pdf')}
        className={styles.btnPrint}
      >
        {({ loading }) =>
          loading ? (
            <>
              <IconPrinter size={16} aria-hidden="true" />
              Gerando…
            </>
          ) : (
            <>
              <IconPrinter size={16} aria-hidden="true" />
              PDF preto e branco
            </>
          )
        }
      </PDFDownloadLink>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.btnWhatsapp}
      >
        <IconBrandWhatsapp size={16} aria-hidden="true" />
        Enviar no WhatsApp
      </a>
    </div>
  )
}
