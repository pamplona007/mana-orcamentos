import type { Icon } from '@tabler/icons-react';
import {
  IconCrown,
  IconStar,
  IconTarget,
  IconStarFilled,
} from '@tabler/icons-react';
import type { PlanoId } from '@/types/orcamento';
import {
  ADICIONAL_ENTRADA,
  ADICIONAL_SALGADO_EXTRA,
  PRECOS_PLANOS,
} from './precos';

export {
  ADICIONAL_ENTRADA,
  ADICIONAL_SALGADO_EXTRA,
  BATE_LIMITE_HORAS,
  DESCONTO_AVISTA,
  LIMITE_KM_DESLOCAMENTO,
  PARCELAS,
} from './precos';

export type Plano = {
  id: PlanoId;
  numero: 1 | 2 | 3 | 4;
  nome: string;
  tagline: string;
  descricao: string;
  badge?: 'RECOMENDADO' | 'MAIS VANTAJOSO';
  icone: Icon;
  iconeLabel: string;
  cor: 'wine' | 'ochre' | 'rust' | 'cream';
  precoPessoaParcelado: number;
  precoPessoaAvista: number;
  precoPizzaParcelado?: number;
  precoPizzaAvista?: number;
  pizzasPorPessoa?: number;
  inclusos: readonly string[];
  saboresPremium?: readonly string[];
  destaquesPremium?: readonly { titulo: string; corpo: string }[];
  duracao: string;
  bonus: readonly string[];
};

export const PLANOS: readonly Plano[] = [
  {
    id: 'premium',
    numero: 1,
    nome: 'Premium',
    tagline: 'A verdadeira pizzaria italiana no seu evento',
    descricao:
      'Massa maturada por 48h em trigo italiano importado, molho de tomate italiano, assada em pedra de alta temperatura.',
    badge: 'RECOMENDADO',
    icone: IconCrown,
    iconeLabel: 'Coroa',
    cor: 'wine',
    precoPessoaParcelado: PRECOS_PLANOS.premium.parcelado,
    precoPessoaAvista: PRECOS_PLANOS.premium.avista,
    inclusos: [
      'Serviço de garçom (pizzas e bebidas)',
      'Bebidas: refrigerante, suco e água',
      '3 horas de serviço livre e ilimitado',
      '1 pizzaiolo dedicado',
      '1 garçom a cada 40 convidados',
      'Luvas, guardanapos e copos descartáveis',
      'Sabores tradicionais, especiais, doces e salgados',
    ],
    saboresPremium: [
      'Margherita premium (búfala)',
      'Pepperoni premium',
      '4 queijos com melaço',
      'Brie com geleia de pimenta',
      'Mortadela italiana com burrata e raspas de limão siciliano',
      'Rúcula com Parma',
      'Caprese (tomate cereja com azeitonas pretas)',
      'Copa lombo com Brie',
    ],
    destaquesPremium: [
      {
        titulo: 'Trigo italiano importado',
        corpo: 'Mesma farinha das pizzarias de Nápoles, maturada por 48 horas.',
      },
      {
        titulo: 'Muçarela de búfala à escolha',
        corpo: 'Até 3 sabores premium preparados com búfala de verdade.',
      },
      {
        titulo: 'Pizzaiolo exclusivo',
        corpo: 'Pizzas assadas na hora, no seu evento, do início ao fim.',
      },
      {
        titulo: 'Bebidas liberadas',
        corpo: 'Refrigerante, suco e água servidos pelo garçom, sem limite.',
      },
    ],
    duracao: '3 horas',
    bonus: ['Deslocamento até 25 km'],
  },
  {
    id: 'livre-bebida',
    numero: 2,
    nome: 'Rodízio Livre',
    tagline: 'Pizzaria completa sem se preocupar com nada',
    descricao:
      'Estrutura completa de pizzaria no seu evento: pizzas, garçons e bebidas liberadas.',
    icone: IconStar,
    iconeLabel: 'Estrela',
    cor: 'ochre',
    precoPessoaParcelado: PRECOS_PLANOS.livreBebida.parcelado,
    precoPessoaAvista: PRECOS_PLANOS.livreBebida.avista,
    inclusos: [
      'Serviço de garçom (pizzas e bebidas)',
      'Bebidas: refrigerante, suco e água',
      '3 horas de serviço livre e ilimitado',
      '1 pizzaiolo',
      '1 garçom a cada 40 convidados',
      'Luvas, guardanapos e copos descartáveis',
      '30 sabores tradicionais e especiais (doces e salgados)',
    ],
    duracao: '3 horas',
    bonus: ['Deslocamento até 25 km'],
  },
  {
    id: 'livre-sem-bebida',
    numero: 3,
    nome: 'Rodízio sem bebida',
    tagline: 'Rodízio completo, você leva as bebidas',
    descricao:
      'Mesma experiência do rodízio livre, sem as bebidas. Ideal quando o evento já tem open bar ou饮品 à parte.',
    icone: IconStarFilled,
    iconeLabel: 'Estrela preenchida',
    cor: 'rust',
    precoPessoaParcelado: PRECOS_PLANOS.livreSemBebida.parcelado,
    precoPessoaAvista: PRECOS_PLANOS.livreSemBebida.avista,
    inclusos: [
      'Serviço de garçom (pizzas)',
      '3 horas de serviço livre e ilimitado',
      '1 pizzaiolo',
      '1 garçom a cada 40 convidados',
      'Luvas, guardanapos e copos descartáveis',
      '30 sabores tradicionais e especiais (doces e salgados)',
    ],
    duracao: '3 horas',
    bonus: ['Deslocamento até 25 km'],
  },
  {
    id: 'unidade',
    numero: 4,
    nome: 'Pizzas por unidade',
    tagline: 'Self service, você controla a quantidade',
    descricao:
      'Mesa fixa de self service com 30 sabores. Ideal para eventos com outras comidas ou lista de convidados aberta.',
    icone: IconTarget,
    iconeLabel: 'Alvo',
    cor: 'cream',
    precoPessoaParcelado: PRECOS_PLANOS.unidade.parcelado,
    precoPessoaAvista: PRECOS_PLANOS.unidade.avista,
    precoPizzaParcelado: PRECOS_PLANOS.unidade.parcelado,
    precoPizzaAvista: PRECOS_PLANOS.unidade.avista,
    pizzasPorPessoa: 0.6,
    inclusos: [
      'Self service: mesa fixa',
      'Luvas e guardanapos',
      '30 sabores tradicionais e especiais',
    ],
    duracao: '3 horas',
    bonus: ['Deslocamento até 25 km'],
  },
] as const;

export const PLANO_POR_ID = Object.fromEntries(
  PLANOS.map((p) => [p.id, p]),
) as Record<PlanoId, Plano>;

export const OPCIONAIS = {
  entrada: {
    label: 'Entrada de salgados + batata frita',
    descricao: '2 centos de salgados + 2 kg de batata',
    valor: ADICIONAL_ENTRADA,
  },
  salgadoExtra: {
    label: 'Cento de salgados adicional',
    valor: ADICIONAL_SALGADO_EXTRA,
  },
  deslocamento: {
    label: 'Deslocamento',
    descricao: 'Para eventos acima de 25 km do centro de Fortaleza',
    valor: '~R$ 150,00',
  },
} as const;
