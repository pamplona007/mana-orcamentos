export type DadosMensagemWhatsApp = {
  template: string
  nome?: string
  empresa?: string
  data?: string
  cidade?: string
  condicao?: string
  validadeHoras?: number | string
}

export function mensagemWhatsApp({
  template,
  nome = '',
  empresa = '',
  data = '',
  cidade = '',
  condicao = '',
  validadeHoras = '',
}: DadosMensagemWhatsApp): string {
  return template
    .replace(/\{nome\}/g, () => (nome ? `, ${nome}` : ''))
    .replace(/\{empresa\}/g, () => empresa)
    .replace(/\{deData\}/g, () => (data ? ` de ${data}` : ''))
    .replace(/\{emCidade\}/g, () => (cidade ? ` (${cidade})` : ''))
    .replace(/\{condicao\}/g, () => condicao)
    .replace(/\{validadeHoras\}/g, () => String(validadeHoras))
}

export function linkWhatsApp(texto: string, telefone: string): string {
  const phone = telefone.replace(/\D/g, '')
  const params = new URLSearchParams({ text: texto })
  if (phone) params.set('phone', `55${phone}`)
  return `https://wa.me/?${params.toString()}`
}
