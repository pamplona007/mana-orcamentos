import { useState } from 'react'
import { IconBuilding, IconClock, IconDownload, IconUpload, IconRestore, IconCheck } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import styles from './styles.module.scss'

export function Settings() {
  const { config, setEmpresa, setValidade, reset, importar, exportar } = useConfig()
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
    if (window.confirm('Restaurar todas as configurações para o padrão? Os dados atuais serão substituídos.')) {
      reset()
    }
  }

  return (
    <div className={styles.settings}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Configurações</span>
          <h1 className={styles.title}>Ajustes da pizzaria</h1>
          <p className={styles.subtitle}>
            As alterações ficam salvas no seu navegador. Você pode exportar e importar um arquivo JSON pra
            compartilhar entre dispositivos.
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

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <IconBuilding size={18} aria-hidden="true" />
          <h2 className={styles.sectionTitle}>Empresa</h2>
        </div>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="emp-nome">Nome fantasia</label>
            <input
              id="emp-nome"
              className={styles.fieldInput}
              value={config.empresa.nomeFantasia}
              onChange={(e) => setEmpresa({ nomeFantasia: e.target.value })}
              placeholder="Maná Pizzas & Eventos"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="emp-tel">Telefone</label>
            <input
              id="emp-tel"
              className={styles.fieldInput}
              value={config.empresa.telefone}
              onChange={(e) => setEmpresa({ telefone: e.target.value })}
              placeholder="(85) 99999-9999"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="emp-whats">WhatsApp</label>
            <input
              id="emp-whats"
              className={styles.fieldInput}
              value={config.empresa.whatsapp}
              onChange={(e) => setEmpresa({ whatsapp: e.target.value })}
              placeholder="(85) 99999-9999"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="emp-email">E-mail</label>
            <input
              id="emp-email"
              type="email"
              className={styles.fieldInput}
              value={config.empresa.email}
              onChange={(e) => setEmpresa({ email: e.target.value })}
              placeholder="contato@exemplo.com"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="emp-ig">Instagram</label>
            <input
              id="emp-ig"
              className={styles.fieldInput}
              value={config.empresa.instagram}
              onChange={(e) => setEmpresa({ instagram: e.target.value })}
              placeholder="@manarodizio"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="emp-site">Site</label>
            <input
              id="emp-site"
              className={styles.fieldInput}
              value={config.empresa.site}
              onChange={(e) => setEmpresa({ site: e.target.value })}
              placeholder="manarodizio.com.br"
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.fieldLabel} htmlFor="emp-end">Endereço</label>
            <input
              id="emp-end"
              className={styles.fieldInput}
              value={config.empresa.endereco}
              onChange={(e) => setEmpresa({ endereco: e.target.value })}
              placeholder="Rua Exemplo, 123, Bairro, Cidade - UF"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="emp-cidade">Cidade</label>
            <input
              id="emp-cidade"
              className={styles.fieldInput}
              value={config.empresa.cidade}
              onChange={(e) => setEmpresa({ cidade: e.target.value })}
              placeholder="Fortaleza"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="emp-estado">Estado</label>
            <input
              id="emp-estado"
              className={styles.fieldInput}
              value={config.empresa.estado}
              onChange={(e) => setEmpresa({ estado: e.target.value })}
              placeholder="CE"
              maxLength={2}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="emp-cnpj">CNPJ</label>
            <input
              id="emp-cnpj"
              className={styles.fieldInput}
              value={config.empresa.cnpj}
              onChange={(e) => setEmpresa({ cnpj: e.target.value })}
              placeholder="00.000.000/0001-00"
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <IconClock size={18} aria-hidden="true" />
          <h2 className={styles.sectionTitle}>Validade do orçamento</h2>
        </div>
        <p className={styles.helperText}>
          Após esse tempo, o orçamento aparece como "Expirado" no histórico e o atendente precisa gerar um novo.
        </p>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="val-horas">Validade (em horas)</label>
            <input
              id="val-horas"
              type="number"
              min={1}
              step={1}
              className={styles.fieldInput}
              value={config.validade.horas}
              onChange={(e) => setValidade({ horas: Math.max(1, Number(e.target.value) || 1) })}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
