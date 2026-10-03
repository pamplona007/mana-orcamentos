export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatBRLCompact(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCentavos(value: number): string {
  const inteiro = Math.floor(value)
  const centavos = Math.round((value - inteiro) * 100)
  return `${inteiro},${centavos.toString().padStart(2, '0')}`
}

export function parseBRL(input: string): number {
  const cleaned = input.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')
  const parsed = Number.parseFloat(cleaned)
  return Number.isFinite(parsed) ? parsed : 0
}

export function roundParcela(total: number, parcelas: number): number {
  return Math.round((total / parcelas) * 100) / 100
}

export function applyDescontoAvista(total: number, desconto: number): number {
  return Math.round(total * (1 - desconto) * 100) / 100
}
