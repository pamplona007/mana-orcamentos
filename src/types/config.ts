export type ConfigEmpresa = {
  nomeFantasia: string
  telefone: string
  whatsapp: string
  email: string
  instagram: string
  site: string
  endereco: string
  cnpj: string
  cidade: string
  estado: string
}

export type ConfigValidade = {
  horas: number
}

export type Config = {
  empresa: ConfigEmpresa
  validade: ConfigValidade
}

export const CONFIG_DEFAULT: Config = {
  empresa: {
    nomeFantasia: 'Maná Pizzas & Eventos',
    telefone: '(85) 99280-3884',
    whatsapp: '(85) 99280-3884',
    email: '',
    instagram: '@manarodizio',
    site: 'manarodizio.com.br',
    endereco: 'Fortaleza, CE',
    cnpj: '',
    cidade: 'Fortaleza',
    estado: 'CE',
  },
  validade: {
    horas: 48,
  },
}
