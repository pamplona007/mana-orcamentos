export type PlanoId = 'premium' | 'livre-bebida' | 'livre-sem-bebida' | 'unidade';

export type Convidado = {
  adultos: number;
  criancas0a4: number;
  criancas5a9: number;
};

export type Adicional = {
  entrada: boolean;
  salgadosExtras: number;
};

export type Evento = {
  data: string;
  cidadeBairro: string;
  observacoes: string;
};

export type Pagamento = 'pix' | 'parcelado';

export type Cliente = {
  nome: string;
  whatsapp: string;
};

export type Orcamento = {
  id: string;
  criadoEm: string;
  cliente: Cliente;
  evento: Evento;
  convidados: Convidado;
  plano: PlanoId;
  adicionais: Adicional;
  pagamento: Pagamento;
};

export type Totais = {
  adultosEquivalentes: number;
  pizzas: number;
  subtotal: number;
  adicionais: number;
  total: number;
  totalParcelado: number;
  totalAvista: number;
  parcela10x: number;
};

export type MensagemWhatsApp = {
  texto: string;
  url: string;
};
