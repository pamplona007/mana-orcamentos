import { useState } from 'react'
import { IconDownload, IconUpload, IconRestore, IconCheck } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import styles from './styles.module.scss'

export function SettingsHeader() {
  const { exportar, importar, reset } = useConfig()
  const [importStatus, setImportStatus] = useState<'idle' | 'ok' | 'error'>('idle')

  const handleExportar = () => {
    const json = exportar()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mana-config-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      importar(text)
      setImportStatus('ok')
      setTimeout(() => setImportStatus('idle'), 2500)
    } catch {
      setImportStatus('error')
      setTimeout(() => setImportStatus('idle'), 2500)
    } finally {
      e.target.value = ''
    }
  }

  const handleReset = () => {
    if (
      window.confirm(
        'Restaurar todas as configurações para o padrão? Os dados atuais serão substituídos.',
      )
    ) {
      reset()
    }
  }

  return (
    <>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Configurações</span>
          <h1 className={styles.title}>Ajustes da pizzaria</h1>
          <p className={styles.subtitle}>
            As alterações ficam salvas no seu navegador. Você pode exportar e importar um arquivo
            JSON pra compartilhar entre dispositivos.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" onClick={handleExportar} className={styles.headerBtn}>
            <IconDownload size={14} aria-hidden="true" />
            Exportar
          </button>
          <label className={styles.headerBtn}>
            <IconUpload size={14} aria-hidden="true" />
            Importar
            <input
              type="file"
              accept="application/json,.json"
              onChange={handleImportar}
              className={styles.fileInput}
              aria-label="Importar arquivo de configurações"
            />
          </label>
          <button type="button" onClick={handleReset} className={styles.headerBtnDanger}>
            <IconRestore size={14} aria-hidden="true" />
            Restaurar padrão
          </button>
        </div>
      </header>

      {importStatus === 'ok' && (
        <div className={styles.toast} role="status">
          <IconCheck size={16} aria-hidden="true" />
          Configurações importadas com sucesso.
        </div>
      )}
      {importStatus === 'error' && (
        <div className={`${styles.toast} ${styles.toastError}`} role="alert">
          Não foi possível ler o arquivo. Verifique se é um JSON válido.
        </div>
      )}
    </>
  )
}
