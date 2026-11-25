import { IconBuilding } from '@tabler/icons-react'
import { useConfig } from '@/hooks/useConfig'
import type { ConfigEmpresa } from '@/types/config'
import { SettingsSection } from '@/components/SettingsSection'
import { SettingsGrid } from '@/components/SettingsGrid'
import { SettingsField } from '@/components/SettingsField'

type CampoEmpresa = {
  id: string
  label: string
  key: keyof ConfigEmpresa
  placeholder: string
  type?: string
  maxLength?: number
  full?: boolean
}

const CAMPOS: CampoEmpresa[] = [
  { id: 'emp-nome', label: 'Nome fantasia', key: 'nomeFantasia', placeholder: 'Maná Pizzas & Eventos' },
  { id: 'emp-tel', label: 'Telefone', key: 'telefone', placeholder: '(85) 99999-9999' },
  { id: 'emp-whats', label: 'WhatsApp', key: 'whatsapp', placeholder: '(85) 99999-9999' },
  { id: 'emp-email', label: 'E-mail', key: 'email', placeholder: 'contato@exemplo.com', type: 'email' },
  { id: 'emp-ig', label: 'Instagram', key: 'instagram', placeholder: '@manarodizio' },
  { id: 'emp-site', label: 'Site', key: 'site', placeholder: 'manarodizio.com.br' },
  {
    id: 'emp-end',
    label: 'Endereço',
    key: 'endereco',
    placeholder: 'Rua Exemplo, 123, Bairro, Cidade - UF',
    full: true,
  },
  { id: 'emp-cidade', label: 'Cidade', key: 'cidade', placeholder: 'Fortaleza' },
  { id: 'emp-estado', label: 'Estado', key: 'estado', placeholder: 'CE', maxLength: 2 },
  { id: 'emp-cnpj', label: 'CNPJ', key: 'cnpj', placeholder: '00.000.000/0001-00' },
]

export function SettingsEmpresa() {
  const { config, setEmpresa } = useConfig()

  return (
    <SettingsSection icon={<IconBuilding size={18} aria-hidden="true" />} title="Empresa">
      <SettingsGrid>
        {CAMPOS.map((campo) => (
          <SettingsField
            key={campo.id}
            id={campo.id}
            label={campo.label}
            full={campo.full}
          >
            <input
              id={campo.id}
              type={campo.type ?? 'text'}
              maxLength={campo.maxLength}
              value={config.empresa[campo.key]}
              onChange={(e) =>
                setEmpresa({ [campo.key]: e.target.value } as Partial<ConfigEmpresa>)
              }
              placeholder={campo.placeholder}
            />
          </SettingsField>
        ))}
      </SettingsGrid>
    </SettingsSection>
  )
}
