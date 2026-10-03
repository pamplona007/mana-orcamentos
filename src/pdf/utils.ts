export function pdfFormatBRL(value: number): { cifrao: string; inteiro: string; centavos: string } {
  const fixed = Math.abs(value).toFixed(2)
  const [inteiro, centavos = '00'] = fixed.split('.')
  const formatted = Number(inteiro).toLocaleString('pt-BR')
  return { cifrao: 'R$', inteiro: formatted, centavos }
}

export function pdfData(dataISO: string): string {
  if (!dataISO) return 'A definir'
  const d = new Date(dataISO + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
