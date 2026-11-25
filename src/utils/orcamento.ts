export type StatusOrcamento = {
  label: 'Rascunho' | 'Válido' | 'Expirado'
  tone: 'fresh' | 'ok' | 'expired'
}

export function statusDoOrcamento(
  orcamento: { criadoEm: string },
  validadeISO: string,
): StatusOrcamento {
  if (orcamento.criadoEm > new Date(Date.now() - 5 * 60 * 1000).toISOString()) {
    return { label: 'Rascunho', tone: 'fresh' }
  }
  if (new Date(validadeISO) < new Date()) {
    return { label: 'Expirado', tone: 'expired' }
  }
  return { label: 'Válido', tone: 'ok' }
}
