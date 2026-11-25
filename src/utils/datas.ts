export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function formatarMes(iso: string): string {
  const d = new Date(iso)
  return `${MESES[d.getMonth()]} ${d.getFullYear()}`
}

export function formatarData(dataISO: string): string {
  if (!dataISO) return 'A definir'
  const d = new Date(dataISO.includes('T') ? dataISO : `${dataISO}T12:00:00`)
  if (Number.isNaN(d.getTime())) return 'A definir'
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
