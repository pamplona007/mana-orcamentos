import { IconPalette } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import { SettingsSection } from '@/components/SettingsSection'
import { SettingsGrid } from '@/components/SettingsGrid'
import { SettingsField } from '@/components/SettingsField'

function parseLinhas(valor: string): string[] {
  return valor
    .split('\n')
    .map((linha) => linha.trim())
    .filter(Boolean)
}

export function SettingsCardapio() {
  const { config, setPdf } = useConfig()
  const cardapio = config.pdf.cardapio

  return (
    <SettingsSection
      icon={<IconPalette size={18} aria-hidden="true" />}
      title="Cardápio do PDF"
      helper={
        <>
          Deixe em branco para usar a lista padrão. Se preencher, sua lista substitui a padrão. Um
          sabor por linha.
        </>
      }
    >
      <SettingsGrid>
        <SettingsField id="card-salgados" label="Salgados customizados" full>
          <textarea
            id="card-salgados"
            placeholder="Um por linha. Vazio = lista padrão (21 sabores)."
            value={cardapio.salgadosCustomizados.join('\n')}
            onChange={(e) =>
              setPdf({
                cardapio: {
                  ...cardapio,
                  salgadosCustomizados: parseLinhas(e.target.value),
                },
              })
            }
          />
        </SettingsField>
        <SettingsField id="card-doces" label="Doces customizados" full>
          <textarea
            id="card-doces"
            placeholder="Um por linha. Vazio = lista padrão (6 sabores)."
            value={cardapio.docesCustomizados.join('\n')}
            onChange={(e) =>
              setPdf({
                cardapio: {
                  ...cardapio,
                  docesCustomizados: parseLinhas(e.target.value),
                },
              })
            }
          />
        </SettingsField>
      </SettingsGrid>
    </SettingsSection>
  )
}
