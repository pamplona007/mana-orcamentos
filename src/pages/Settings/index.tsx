import { useMemo } from 'react'
import { ConfigContext } from '@/contexts/configContext'
import { useConfig } from '@/hooks/useConfig'
import { sanitizarConfig } from '@/schemas/configSchema'
import { SettingsHeader } from '@/components/SettingsHeader'
import { SettingsEmpresa } from '@/components/SettingsEmpresa'
import { SettingsValidade } from '@/components/SettingsValidade'
import { SettingsPadroes } from '@/components/SettingsPadroes'
import { SettingsMensagem } from '@/components/SettingsMensagem'
import { SettingsPrecos } from '@/components/SettingsPrecos'
import { SettingsAdicionais } from '@/components/SettingsAdicionais'
import { SettingsCapa } from '@/components/SettingsCapa'
import { SettingsCardapio } from '@/components/SettingsCardapio'
import styles from './styles.module.scss'

export function Settings() {
  const ctx = useConfig()

  // O localStorage pode guardar config parcial ou de versão antiga. Sanitizar na
  // leitura evita que um campo inválido derrube a tela de Configurações.
  const value = useMemo(() => ({ ...ctx, config: sanitizarConfig(ctx.config) }), [ctx])

  return (
    <ConfigContext.Provider value={value}>
      <div className={styles.settings}>
        <SettingsHeader />
        <SettingsEmpresa />
        <SettingsValidade />
        <SettingsPadroes />
        <SettingsMensagem />
        <SettingsPrecos />
        <SettingsAdicionais />
        <SettingsCapa />
        <SettingsCardapio />
      </div>
    </ConfigContext.Provider>
  )
}
