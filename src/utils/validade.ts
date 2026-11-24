export function dataValidade(criadoEm: string, horas: number): string {
  const data = new Date(criadoEm)
  data.setHours(data.getHours() + horas)
  return data.toISOString()
}
