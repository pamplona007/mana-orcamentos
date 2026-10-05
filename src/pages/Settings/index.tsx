import { useState } from 'react'
import {
  IconBuilding,
  IconClock,
  IconUsers,
  IconMessageDots,
  IconReceipt,
  IconBook2,
  IconPalette,
  IconDownload,
  IconUpload,
  IconRestore,
  IconCheck,
} from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import styles from './styles.module.scss'

export function Settings() {
  const { config, setEmpresa, setValidade, setEditor, setWhatsApp, setPdf, reset, importar, exportar } = useConfig()
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

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <IconUsers size={18} aria-hidden="true" />
          <h2 className={styles.sectionTitle}>Padrões do editor</h2>
        </div>
        <p className={styles.helperText}>
          Esses valores preenchem o editor toda vez que ele é aberto (ou quando o atendente clica em "limpar").
        </p>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="ed-adultos">Adultos</label>
            <input
              id="ed-adultos"
              type="number"
              min={0}
              step={1}
              className={styles.fieldInput}
              value={config.editor.convidadosPadrao.adultos}
              onChange={(e) => setEditor({ convidadosPadrao: { ...config.editor.convidadosPadrao, adultos: Math.max(0, Number(e.target.value) || 0) } })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="ed-c0a4">Crianças 0–4</label>
            <input
              id="ed-c0a4"
              type="number"
              min={0}
              step={1}
              className={styles.fieldInput}
              value={config.editor.convidadosPadrao.criancas0a4}
              onChange={(e) => setEditor({ convidadosPadrao: { ...config.editor.convidadosPadrao, criancas0a4: Math.max(0, Number(e.target.value) || 0) } })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="ed-c5a9">Crianças 5–9</label>
            <input
              id="ed-c5a9"
              type="number"
              min={0}
              step={1}
              className={styles.fieldInput}
              value={config.editor.convidadosPadrao.criancas5a9}
              onChange={(e) => setEditor({ convidadosPadrao: { ...config.editor.convidadosPadrao, criancas5a9: Math.max(0, Number(e.target.value) || 0) } })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="ed-pag">Pagamento padrão</label>
            <select
              id="ed-pag"
              className={styles.fieldInput}
              value={config.editor.pagamentoPadrao}
              onChange={(e) => setEditor({ pagamentoPadrao: e.target.value as 'pix' | 'parcelado' })}
            >
              <option value="parcelado">Parcelado em 10x</option>
              <option value="pix">À vista no Pix</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="ed-desloc-check">Deslocamento por padrão</label>
            <label className={styles.checkboxRow}>
              <input
                id="ed-desloc-check"
                type="checkbox"
                checked={config.editor.deslocamentoPadrao.ativo}
                onChange={(e) => setEditor({ deslocamentoPadrao: { ...config.editor.deslocamentoPadrao, ativo: e.target.checked } })}
              />
              <span>Ativar por padrão</span>
            </label>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="ed-desloc-valor">Valor do deslocamento (R$)</label>
            <input
              id="ed-desloc-valor"
              type="number"
              min={0}
              step={1}
              className={styles.fieldInput}
              value={config.editor.deslocamentoPadrao.valor}
              onChange={(e) => setEditor({ deslocamentoPadrao: { ...config.editor.deslocamentoPadrao, valor: Math.max(0, Number(e.target.value) || 0) } })}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <IconMessageDots size={18} aria-hidden="true" />
          <h2 className={styles.sectionTitle}>Mensagem do WhatsApp</h2>
        </div>
        <p className={styles.helperText}>
          Template enviado junto com o PDF. Use as variáveis abaixo. O preview à direita mostra como a mensagem
          fica com os dados atuais do editor.
        </p>
        <div className={styles.whatsappLayout}>
          <div className={styles.whatsappField}>
            <label className={styles.fieldLabel} htmlFor="wa-template">Template</label>
            <textarea
              id="wa-template"
              className={styles.fieldTextarea}
              value={config.whatsapp.template}
              onChange={(e) => setWhatsApp({ template: e.target.value })}
              rows={12}
            />
            <div className={styles.variaveis}>
              <span className={styles.variaveisLabel}>Variáveis:</span>
              <code>{'{nome}'}</code>
              <code>{'{empresa}'}</code>
              <code>{'{deData}'}</code>
              <code>{'{emCidade}'}</code>
              <code>{'{condicao}'}</code>
              <code>{'{validadeHoras}'}</code>
            </div>
          </div>
          <div className={styles.whatsappPreview}>
            <span className={styles.whatsappPreviewLabel}>Preview</span>
            <pre className={styles.whatsappPreviewText}>{(() => {
              const condicao = 'à vista no Pix com 15% de desconto'
              return config.whatsapp.template
                .replace(/\{nome\}/g, ', Maria Silva')
                .replace(/\{empresa\}/g, config.empresa.nomeFantasia)
                .replace(/\{deData\}/g, ' de 15/11/2026')
                .replace(/\{emCidade\}/g, ' (Fortaleza, Aldeota)')
                .replace(/\{condicao\}/g, condicao)
                .replace(/\{validadeHoras\}/g, String(config.validade.horas))
            })()}</pre>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <IconReceipt size={18} aria-hidden="true" />
          <h2 className={styles.sectionTitle}>Preços dos planos</h2>
        </div>
        <p className={styles.helperText}>
          Valor por pessoa (ou por pizza no plano por unidade). Parcelado é o preço cheio
          no cartão; à vista é o valor com o desconto Pix aplicado.
        </p>
        <div className={styles.fieldGrid}>
          <PriceField
            label="Premium · parcelado"
            value={config.pdf.precos.premium.parcelado}
            onChange={(v) => setPdf({ precos: { ...config.pdf.precos, premium: { ...config.pdf.precos.premium, parcelado: v } } })}
          />
          <PriceField
            label="Premium · à vista"
            value={config.pdf.precos.premium.avista}
            onChange={(v) => setPdf({ precos: { ...config.pdf.precos, premium: { ...config.pdf.precos.premium, avista: v } } })}
          />
          <PriceField
            label="Rodízio livre · parcelado"
            value={config.pdf.precos.livreBebida.parcelado}
            onChange={(v) => setPdf({ precos: { ...config.pdf.precos, livreBebida: { ...config.pdf.precos.livreBebida, parcelado: v } } })}
          />
          <PriceField
            label="Rodízio livre · à vista"
            value={config.pdf.precos.livreBebida.avista}
            onChange={(v) => setPdf({ precos: { ...config.pdf.precos, livreBebida: { ...config.pdf.precos.livreBebida, avista: v } } })}
          />
          <PriceField
            label="Sem bebida · parcelado"
            value={config.pdf.precos.livreSemBebida.parcelado}
            onChange={(v) => setPdf({ precos: { ...config.pdf.precos, livreSemBebida: { ...config.pdf.precos.livreSemBebida, parcelado: v } } })}
          />
          <PriceField
            label="Sem bebida · à vista"
            value={config.pdf.precos.livreSemBebida.avista}
            onChange={(v) => setPdf({ precos: { ...config.pdf.precos, livreSemBebida: { ...config.pdf.precos.livreSemBebida, avista: v } } })}
          />
          <PriceField
            label="Por unidade · parcelado"
            value={config.pdf.precos.unidade.parcelado}
            onChange={(v) => setPdf({ precos: { ...config.pdf.precos, unidade: { ...config.pdf.precos.unidade, parcelado: v } } })}
          />
          <PriceField
            label="Por unidade · à vista"
            value={config.pdf.precos.unidade.avista}
            onChange={(v) => setPdf({ precos: { ...config.pdf.precos, unidade: { ...config.pdf.precos.unidade, avista: v } } })}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <IconClock size={18} aria-hidden="true" />
          <h2 className={styles.sectionTitle}>Adicionais e pagamento</h2>
        </div>
        <p className={styles.helperText}>
          Adicionais do cardápio, percentual de desconto à vista no Pix e número de parcelas.
        </p>
        <div className={styles.fieldGrid}>
          <PriceField
            label="Entrada (R$)"
            value={config.pdf.adicionais.entrada}
            onChange={(v) => setPdf({ adicionais: { ...config.pdf.adicionais, entrada: v } })}
            step={1}
          />
          <PriceField
            label="Cento extra (R$)"
            value={config.pdf.adicionais.salgadoExtra}
            onChange={(v) => setPdf({ adicionais: { ...config.pdf.adicionais, salgadoExtra: v } })}
            step={1}
          />
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="adi-desc">Desconto à vista (0–1)</label>
            <input
              id="adi-desc"
              type="number"
              min={0}
              max={1}
              step={0.01}
              className={styles.fieldInput}
              value={config.pdf.adicionais.descontoAvista}
              onChange={(e) => setPdf({ adicionais: { ...config.pdf.adicionais, descontoAvista: Math.min(1, Math.max(0, Number(e.target.value) || 0)) } })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="adi-parc">Parcelas</label>
            <input
              id="adi-parc"
              type="number"
              min={1}
              max={24}
              step={1}
              className={styles.fieldInput}
              value={config.pdf.adicionais.parcelas}
              onChange={(e) => setPdf({ adicionais: { ...config.pdf.adicionais, parcelas: Math.max(1, Number(e.target.value) || 1) } })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="adi-km">Limite de km (deslocamento)</label>
            <input
              id="adi-km"
              type="number"
              min={0}
              step={1}
              className={styles.fieldInput}
              value={config.pdf.adicionais.limiteKmDeslocamento}
              onChange={(e) => setPdf({ adicionais: { ...config.pdf.adicionais, limiteKmDeslocamento: Math.max(0, Number(e.target.value) || 0) } })}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <IconBook2 size={18} aria-hidden="true" />
          <h2 className={styles.sectionTitle}>Textos da Capa</h2>
        </div>
        <p className={styles.helperText}>
          O bloco "Sobre a Maná" e as 3 promessas exibidas no rodapé da primeira página do PDF.
          Use 3 promessas no máximo.
        </p>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="capa-kicker">Kicker do sobre</label>
            <input
              id="capa-kicker"
              type="text"
              className={styles.fieldInput}
              value={config.pdf.capa.sobreKicker}
              onChange={(e) => setPdf({ capa: { ...config.pdf.capa, sobreKicker: e.target.value } })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="capa-titulo">Título do sobre</label>
            <input
              id="capa-titulo"
              type="text"
              className={styles.fieldInput}
              value={config.pdf.capa.sobreTitulo}
              onChange={(e) => setPdf({ capa: { ...config.pdf.capa, sobreTitulo: e.target.value } })}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.fieldLabel} htmlFor="capa-corpo">Corpo do sobre</label>
            <textarea
              id="capa-corpo"
              className={styles.fieldTextarea}
              style={{ minHeight: 80 }}
              value={config.pdf.capa.sobreCorpo}
              onChange={(e) => setPdf({ capa: { ...config.pdf.capa, sobreCorpo: e.target.value } })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="capa-rodape">Texto do rodapé</label>
            <input
              id="capa-rodape"
              type="text"
              className={styles.fieldInput}
              value={config.pdf.capa.contatoRodape}
              onChange={(e) => setPdf({ capa: { ...config.pdf.capa, contatoRodape: e.target.value } })}
            />
          </div>
        </div>
        <div className={styles.promessas}>
          <span className={styles.fieldLabel}>Promessas (até 3)</span>
          {config.pdf.capa.promessas.slice(0, 3).map((p, i) => (
            <div key={i} className={styles.promessaRow}>
              <input
                type="text"
                className={styles.fieldInput}
                placeholder={`Título da promessa ${i + 1}`}
                value={p.titulo}
                onChange={(e) => {
                  const promessas: { titulo: string; corpo: string }[] = [...config.pdf.capa.promessas]
                  promessas[i] = { titulo: e.target.value, corpo: p.corpo }
                  setPdf({ capa: { ...config.pdf.capa, promessas } })
                }}
              />
              <textarea
                className={styles.fieldTextarea}
                placeholder={`Corpo da promessa ${i + 1}`}
                style={{ minHeight: 50 }}
                value={p.corpo}
                onChange={(e) => {
                  const promessas: { titulo: string; corpo: string }[] = [...config.pdf.capa.promessas]
                  promessas[i] = { titulo: p.titulo, corpo: e.target.value }
                  setPdf({ capa: { ...config.pdf.capa, promessas } })
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <IconPalette size={18} aria-hidden="true" />
          <h2 className={styles.sectionTitle}>Cardápio do PDF</h2>
        </div>
        <p className={styles.helperText}>
          Deixe em branco para usar a lista padrão. Se preencher, sua lista substitui a padrão.
          Um sabor por linha.
        </p>
        <div className={styles.fieldGrid}>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.fieldLabel} htmlFor="card-salgados">Salgados customizados</label>
            <textarea
              id="card-salgados"
              className={styles.fieldTextarea}
              placeholder="Um por linha. Vazio = lista padrão (21 sabores)."
              value={config.pdf.cardapio.salgadosCustomizados.join('\n')}
              onChange={(e) => setPdf({
                cardapio: {
                  ...config.pdf.cardapio,
                  salgadosCustomizados: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                },
              })}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.fieldLabel} htmlFor="card-doces">Doces customizados</label>
            <textarea
              id="card-doces"
              className={styles.fieldTextarea}
              placeholder="Um por linha. Vazio = lista padrão (6 sabores)."
              value={config.pdf.cardapio.docesCustomizados.join('\n')}
              onChange={(e) => setPdf({
                cardapio: {
                  ...config.pdf.cardapio,
                  docesCustomizados: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                },
              })}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

type PriceFieldProps = {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
}

function PriceField({ label, value, onChange, step = 0.01 }: PriceFieldProps) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        min={0}
        step={step}
        className={styles.fieldInput}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
      />
    </div>
  )
}
