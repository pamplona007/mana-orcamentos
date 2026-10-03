# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React 19 + TypeScript strict, conforme `~/Documents/projects/CLAUDE.md`. SCSS Modules (sem Tailwind). React Hook Form + Zod. @react-pdf/renderer para geração do PDF. @tabler/icons-react. React Router (Editor / Preview / History). Playwright E2E. Deploy Vercel, repo GitHub.

## Users

**Primary:** atendentes da Maná Pizzas & Eventos, no balcão, durante o expediente (celular ou desktop). Geram um PDF por cliente. Não são designers, não são programadores — precisam terminar em 1-2 minutos.

**Secondary (futuro):** clientes finais, se o sistema evoluir para autoatendimento via link público. Fora de escopo agora.

## Product Purpose

Substituir o PDF atual "Orçamento Maná Pizzas — 25 pessoas.pdf" (genérico, não destaca o Premium, exige edição manual de campos como adultos/0-4/5-9). A nova versão é uma ferramenta interna que produz um orçamento editorial pronto pra enviar no WhatsApp, com cálculo automático dos totais e destaque visual real entre os 4 planos.

Sucesso = o atendente preenche os dados, escolhe o plano, gera o PDF, manda no WhatsApp, e o cliente responde "fechado" — sem idas e vindas pra ajustar números.

## Positioning

O PDF antigo trata os 4 planos como opções equivalentes em um único quadro de texto. O novo design **convence**: o Premium tem tratamento visual de produto principal (cor wine, badge animado, "Por que Premium" expandido), os 3 outros são alternativas claras. O cálculo aparece ao vivo enquanto o atendente digita, então o atendente **vê o Premium crescendo em valor agregado** enquanto o cliente escolhe — em vez de jogar 4 preços soltos no papel.

## Operating Context

- Cada orçamento = um cliente, um evento, uma data
- Atendente pode editar valores manualmente em conversa (data, bairro, observações)
- PDF é anexo no WhatsApp + texto de follow-up
- Validade: 48h a partir da geração
- Quitação: 1 dia antes do evento
- Após 22h o valor pode sofrer alteração (hora extra)
- Histórico de orçamentos fica na máquina (sem backend no MVP)
- Não há login no MVP — qualquer atendente acessa e o histórico é local

## Capabilities and Constraints

**Confirmed:**
- 4 planos: Premium c/ bebida, Livre c/ bebida, Livre s/ bebida, Por unidade
- Preços implícitos no PDF original (calculados de cabeça: 117,60 / 66,00 / 58,80 / 78,50)
- À vista = 15% desconto (na prática 15,05-15,27% por arredondamento da parcela)
- Adicional entrada (2 centos salgados + 2kg batata) R$ 350, cento extra R$ 75
- Bônus incluso: deslocamento até 25 km
- Multiplicador crianças 5-9 anos: meia (inferido de padrão de mercado, **a confirmar com Lucas**)
- Multiplicador crianças 0-4 anos: grátis (inferido de padrão de mercado, **a confirmar com Lucas**)

**Deliberately undecided:**
- Multiplicadores infantis exatos (0-4 e 5-9) — vou perguntar no início da Fase 1
- Persistência entre atendentes (v1: localStorage da máquina, v2: backend)
- Login (v1: sem, v2: por senha da pizzaria)

## Brand Commitments

- Nome: **Maná Pizzas & Eventos** (preservado)
- Tagline do PDF: "Pizzas de longa maturação – fermentação à frio" (preservar)
- Fotos reais das pizzas devem ser fornecidas pelo cliente; **até lá, placeholders locais**
- WhatsApp é o canal de entrega final (texto gerado pelo app)
- Vibe: "trattoria editorial" — pasta italiana moderna encontra revista de gastronomia, escuro, quente, gera fome. Conforme Lucas: "premium, com pizzas gerando fome, cores quentes, escuras, com cores vivas para destaque"

## Evidence on Hand

- PDF atual: `/home/pamplona/.var/app/org.telegram.desktop/data/TelegramDesktop/tdata/temp_data/Orçamento Maná Pizzas e Eventos - 25 pessoas.pdf` (extraído pra `/tmp/mana.txt` nesta sessão)
- Não há logo/foto oficial disponível
- Não há histórico de conversas de venda
- Não há analytics

**Futuro trabalho NÃO pode fabricar:** depoimentos, número de clientes atendidos, ranking de sabores, tempo de mercado, prêmios da pizzaria. Tratar como ausência e não inventar.

## Product Principles

1. **O atendente termina em 2 minutos** — qualquer fricção é falha. Auto-save, defaults sensatos, validação silenciosa.
2. **O Premium precisa parecer Premium** — o app convence, não apenas informa. Comparação lado-a-lado é obrigatória; o Premium tem tratamento diferenciado real.
3. **PDF é o produto** — não é export de tela. Tipografia editorial, hierarquia clara, fechamento comercial com validade e condições.
4. **Sem dependência de backend no MVP** — localStorage resolve. Adiar sync pra v2.

## Accessibility & Inclusion

- WCAG AA mínimo (contraste, foco visível, ARIA em toggles e stepper)
- Mobile-first (atendente pode estar no celular)
- pt-BR único idioma no MVP
