# CLAUDE.md — Maná Pizzas & Eventos (Orçamentos)

Instruções específicas deste repositório. Complementa (e, onde a realidade divergir, prevalece sobre) as convenções gerais do workspace.

## O que é este projeto

SPA de orçamentos da Maná Pizzas & Eventos: React 19 + Vite 8 + TypeScript, sem backend, sem auth e sem variáveis de ambiente. O atendente monta o orçamento no Editor, revisa e baixa o PDF (colorido e P&B) no Preview, envia no WhatsApp e arquiva no Histórico local. Leia o [README](README.md) para o onboarding e o [docs/ARQUITETURA.md](docs/ARQUITETURA.md) para o mapa de módulos e os débitos técnicos.

## Comandos

Use **npm** (há `package-lock.json`; instale com `npm ci`).

| Comando | Quando usar |
|---|---|
| `npm ci` | Instalação limpa, reproduzível. |
| `npm run dev` | Dev server em `http://localhost:5173`. |
| `npm run build` | `tsc -b` + `vite build` — é o typecheck + build de produção. |
| `npx tsc -b --noEmit` | Só o typecheck (funciona; `tsconfig` já é `noEmit`). |
| `npm run lint` | `oxlint` (não é ESLint). |
| `npm test` | Vitest, uma execução. |
| `npm run test:watch` | Vitest em watch. |
| `npm run preview` | Serve `dist/` em `http://localhost:4173` (rode `build` antes). |

**Quebrados hoje — não presuma que funcionam:**
`npm run test:ui` (falta `@vitest/ui`), `npm run test:e2e` e `npm run test:e2e:ui` (não existe `playwright.config.ts`; o Playwright coleta os testes do Vitest). `npx vitest run --coverage` falha por falta de `@vitest/coverage-v8`. A correção desses scripts é escopo de outra issue do epic PAMP-221; não os "conserte" de passagem em um PR que não é sobre isso.

## Estrutura

```text
src/
├── components/   # reutilizáveis: uma pasta por componente (index.tsx + styles.module.scss)
├── data/         # dados comerciais estáticos (os 4 planos e textos)
├── hooks/        # estado global: useOrcamento (reducer), useConfig (provider), useTheme
├── pages/        # rotas: Editor, Preview, History, Settings
├── pdf/          # documentos e páginas do PDF (pages/ = colorido, print/ = P&B)
├── storage/      # leitura/escrita no localStorage
├── styles/       # tokens.scss, global.scss, fonts.scss
├── types/        # contratos (Config, Orcamento, Totais)
└── utils/        # domínio puro (calculo.ts, money.ts)
tests/unit/       # testes Vitest
docs/             # documentação do projeto
```

- Alias de import: `@/` → `src/`. Use-o em vez de caminhos relativos longos.
- Cada componente/página tem **pasta própria** com `index.tsx` e `styles.module.scss`. Nunca crie classes globais para estilo de componente.
- A camada de domínio (`utils/`) não deve importar de `pages/`, `components/` ou `pdf/`. Estado via providers em `hooks/`; persistência via `storage/`.

## TypeScript e estilo

- `strict` + `noUncheckedIndexedAccess` + `noUnusedLocals` + `noUnusedParameters`: **nada de `any`**, nada de variável/param não usado, nada de acesso a índice sem tratar `undefined`.
- `verbatimModuleSyntax`: importe tipos com `import type`.
- SCSS Modules por componente; tokens de cor/espaçamento vêm de `src/styles/tokens.scss` (variáveis CSS), não de hex solto na UI.
- Ícones: `@tabler/icons-react`. (Exceção conhecida: o toggle de tema ainda usa glifos — dívida registrada.)
- Formulários: hoje são controlados à mão. `react-hook-form`, `zod` e `@hookform/resolvers` estão instalados e **ainda não são usados**; a migração é escopo de outra issue do epic. Não introduza outra biblioteca de formulário.
- Não há data fetching de servidor. React Query **não se aplica** aqui (não há servidor).
- Evite comentários; quando forem necessários, explique **por que**, não o que o código faz. Não edite `node_modules`.

## Como adicionar um componente

1. Crie `src/components/NomeDoComponente/index.tsx` exportando o componente com nome (`export function NomeDoComponente`), tipando as props com um `type` local.
2. Crie `src/components/NomeDoComponente/styles.module.scss` e importe como `styles`.
3. Use os tokens de `src/styles/tokens.scss` e os ícones Tabler.
4. Acessibilidade mínima: elemento semântico correto, `aria-label` em botões de ícone, `aria-pressed` em toggles, foco visível.
5. Se for reutilizável em mais de uma página, coloque em `components/`; se for específico de uma rota, mantenha dentro da pasta da página.

## Como adicionar um teste

- Testes unitários/de componente em `tests/unit/`, espelhando o módulo (`money.test.ts`, `calculo.test.ts`, `AppShell.test.tsx`).
- Use Vitest (`describe`/`it`/`expect`) e Testing Library (`render`, `screen`). Prefira queries por papel/texto acessível (`getByRole`, `getByLabelText`) — não por classe CSS.
- O DOM é `jsdom` (configurado em `vite.config.ts`) e `tests/setup.ts` carrega o `jest-dom`.
- Para data/hora, use `vi.setSystemTime`/`vi.useFakeTimers`; não dependa do relógio real.
- `localStorage` é real no jsdom: limpe entre os testes do seu bloco para não vazar estado.
- Um teste novo deve falhar se o comportamento esperado for removido — evite asserção só de "renderizou".
- Se o teste revelar um bug, **não conserte o código de produção na mesma issue de teste**: registre o bug e crie a sub-issue de correção conforme o processo do epic.

## Regras de negócio — NÃO "melhore" sem o cliente

Estas regras são contrato comercial. Mudá-las altera o valor cobrado ou o que o cliente lê no PDF. Confirme com o Lucas antes de qualquer alteração de fórmula, percentual ou texto comercial. As pendências abertas estão em [docs/PENDENCIAS-DE-PRODUTO.md](docs/PENDENCIAS-DE-PRODUTO.md).

1. **Multiplicadores infantis** (`src/utils/calculo.ts:16-17`): crianças **0–4 anos = grátis** (`0`); crianças **5–9 anos = meia entrada** (`0,5`). Adultos = 1. O convidado equivalente é `adultos + 0,5 × crianças5a9`.
2. **Pizzas sugeridas**: `ceil(convidadosEquivalentes × 0,6)`. O plano "Por unidade" usa esse número (`src/utils/calculo.ts:26-28,60-68`).
3. **Ordem do cálculo** (`src/utils/calculo.ts:78-108`): subtotal = unidades × preço do plano; **deslocamento entra antes do desconto**; desconto manual percentual (0–100) ou absoluto (limitado à base); total nunca abaixo de zero.
4. **Desconto à vista**: percentual configurável em `config.pdf.adicionais.descontoAvista` (padrão `0,15`) aplicado sobre o total já com deslocamento e desconto manual. **Não** é o preço "à vista" por plano da tela de Configurações — esses campos hoje são write-only (dívida registrada; não os ligue sem decisão de produto).
5. **Deslocamento**: valor fixo por evento (`config.editor.deslocamentoPadrao.valor`, padrão R$ 150), somado quando ativo. Não é por km. O texto "deslocamento até 25 km" é bônus comercial e hoje não é renderizado no PDF.
6. **Parcelamento**: padrão 10× (`config.pdf.adicionais.parcelas`); a parcela é arredondada para 2 casas e o produto das parcelas pode diferir do total em centavos.
7. **Validade**: padrão 48 h (`config.validade.horas`). Preview usa "agora + validade"; Histórico usa "criadoEm + validade". A divergência é conhecida — **não unifique as duas sem decisão**.
8. **Preços**: os valores efetivos vêm de `config.pdf.precos` (4 planos × parcelado/à vista). `src/data/plans.ts` é fallback e fonte dos textos. Não edite preço "no código" para mudar o app: o caminho é a configuração.
9. **Campos não obrigatórios**: hoje é possível gerar e baixar o PDF sem nome, data ou local. **Não torne campos obrigatórios** sem decisão do cliente (pendência registrada).

## Documentação que precisa acompanhar o código

Se você mudar estrutura, comandos, contratos ou regras, mantenha em sincronia:

- [README.md](README.md) — onboarding, scripts, estrutura, persistência.
- [docs/ARQUITETURA.md](docs/ARQUITETURA.md) — mapa de módulos, diagrama e débitos; ao mover/renomear módulos, atualize os caminhos citados.
- `docs/REGRAS-DE-NEGOCIO.md`, `docs/GLOSSARIO.md`, `docs/PENDENCIAS-DE-PRODUTO.md` — domínio e decisões de produto.
- Este arquivo, se mudar comandos ou convenções.

## Fluxo de trabalho

- Uma issue = uma branch = um PR atômico. Não misture reorganização, correção e documentação no mesmo PR.
- Commits no padrão do workspace: `feat: <descrição>` e `test: <descrição>`. PRs só de documentação podem usar um único `feat: docs ...`.
- Linke o PR à issue para fechamento automático. **Não faça merge** — a revisão é de outro agente.
- Não altere arquivos fora do escopo da issue atual; se precisar de algo de outra área, crie uma sub-issue em vez de "resolver de leve".
