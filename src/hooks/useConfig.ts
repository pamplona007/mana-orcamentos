import { useContext } from 'react'
import { ConfigContext, type ConfigCtx } from '@/contexts/configContext'

export function useConfig(): ConfigCtx {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider')
  return ctx
}
