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
  return (
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
  )
}
