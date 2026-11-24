# Maná Pizzas & Eventos — Orçamentos

Aplicativo web interno que **monta orçamentos e os entrega em PDF** para a Maná Pizzas & Eventos. O atendente preenche os dados do evento, o app calcula os quatro planos comerciais e gera um PDF editorial — colorido ou preto e branco — pronto para ser enviado no WhatsApp.

> **Estado atual: prova de conceito funcional.** O app roda de ponta a ponta no navegador, mas não tem backend, autenticação nem sincronização. O histórico vive no `localStorage` da máquina. A organização de código e a cobertura de testes estão em andamento no epic [PAMP-221](https://github.com/pamplona007/mana-orcamentos) (ver [débitos técnicos](docs/ARQUITETURA.md#débitos-técnicos-conhecidos)).

## Quem usa

**Atendentes da pizzaria**, no balcão, durante o expediente — no celular ou no desktop. Não são designers nem programadores. O objetivo de cada atendimento é **sair do zero ao PDF em 1–2 minutos** e mandar o arquivo no WhatsApp para o cliente. Não há login: qualquer pessoa com acesso ao navegador usa o app e enxerga o histórico local.

## O que o app faz

- Monta o orçamento de **um cliente / um evento / uma data**: cliente, WhatsApp, data, cidade/bairro, observações, convidados e adicionais.
- Calcula **quatro planos** ao mesmo tempo (Premium com bebida, Rodízio Livre, Rodízio sem bebida, Pizzas por unidade) a partir dos preços configurados.
- Aplica **deslocamento**, **desconto manual** e a condição **à vista no Pix** sobre cada plano.
- Gera dois PDFs com o mesmo conteúdo: **colorido** e **preto e branco** (para impressão).
- Gera a **mensagem de WhatsApp** a partir de um template configurável.
- **Salva** o orçamento no histórico local, onde pode ser buscado, reaberto, duplicado, reenviado ou excluído.

## Stack

O projeto declara mais bibliotecas do que usa. Esta é a separação real:

### Em uso

| Tecnologia | Versão | Onde aparece |
|---|---|---|
| React | 19.2 | toda a UI (`src/`) |
| Vite | 8.3 | dev server, build e configuração do Vitest (`vite.config.ts`) |
| TypeScript | ~6.0 | `strict` + `noUncheckedIndexedAccess` + `noUnusedLocals/Parameters` |
| react-router-dom | 7 | rotas Editor / Preview / Histórico / Configurações (`src/App.tsx`) |
| Sass (SCSS Modules) | 1.105 | um `styles.module.scss` por componente/página; tokens em `src/styles/` |
| `@react-pdf/renderer` | 4.9 | geração dos PDFs (`src/pdf/`) |
| `@tabler/icons-react` | 3.48 | todos os ícones da UI |
| Vitest | 5.0 | testes unitários (`tests/unit/`) |
| `@testing-library/react` + `jest-dom` | 16.3 / 7.0 | testes de componente |
| jsdom | 30 | ambiente dos testes |
| oxlint | 1.86 | lint (`npm run lint`) |
| `@playwright/test` | 1.63 | declarado para E2E — **configuração ausente**, ver scripts |

### Instaladas e não usadas

Estas dependências estão no `package.json` mas **nenhum arquivo de `src/` as importa**. A adoção está planejada no epic (validação de formulários), não é código morto acidental:

- `react-hook-form`
- `zod`
- `@hookform/resolvers`

### Não existem neste projeto

Sem **backend**, sem **API HTTP**, sem **banco de dados**, sem **autenticação**, sem **variáveis de ambiente** (nenhum `.env`, nenhum `import.meta.env`). Não há Tailwind, Redux, React Query nem CSS-in-JS. A persistência é 100% `localStorage` do navegador.

## Pré-requisitos

- **Node.js 22 ou superior** (verificado com Node 24.21).
- **npm 11** (o repositório tem `package-lock.json`; use `npm ci`).
- Nenhum serviço externo, conta ou chave de API.

## Rodando localmente

```bash
npm ci          # instala exatamente o que está no lockfile
npm run dev     # Vite em http://localhost:5173
```

Para conferir a versão de produção localmente:

```bash
npm run build
npm run preview # Vite preview em http://localhost:4173
```

## Scripts

| Script | Status | O que faz |
|---|---|---|
| `npm run dev` | ✅ funciona | Dev server na porta **5173** |
| `npm run build` | ✅ funciona | `tsc -b` (typecheck) + `vite build` para `dist/` |
| `npm run preview` | ✅ funciona | Serve o `dist/` na porta **4173** |
| `npm run lint` | ✅ funciona (com 7 avisos) | `oxlint`; hoje sai com código 0 |
| `npm test` | ✅ funciona | `vitest run` — 3 arquivos, 41 casos |
| `npm run test:watch` | ✅ funciona | Vitest em modo watch |
| `npm run test:ui` | ❌ quebrado | Falta a dependência `@vitest/ui` (`ERR_MODULE_NOT_FOUND`) |
| `npm run test:e2e` | ❌ quebrado | Não existe `playwright.config.ts`; o runner do Playwright coleta os testes do Vitest em `tests/unit/` e termina em `No tests found` |
| `npm run test:e2e:ui` | ❌ quebrado | Mesma causa do `test:e2e` |

Os scripts quebrados são dívida conhecida e serão corrigidos no estágio de testes do epic; **não os "conserte" isoladamente em um PR de documentação**.

## Testes

- **Unitários e de componente:** `tests/unit/` (`money.test.ts`, `calculo.test.ts`, `AppShell.test.tsx`), com setup compartilhado em `tests/setup.ts`. O Vitest é configurado dentro de `vite.config.ts` (ambiente `jsdom`, `setupFiles`).
- **E2E:** `@playwright/test` está instalado e existe um script avulso `test-preview.mjs`, mas **não há suíte E2E configurada** (sem `playwright.config.ts`, sem diretório de specs, sem CI).

```bash
npm test                    # unitários (Vitest)
npm run test:watch          # unitários em watch
npx vitest run --coverage   # não roda hoje: falta @vitest/coverage-v8
```

Não há CI no repositório (não existe `.github/`).

## Estrutura de pastas

```text
mana-orcamentos/
├── docs/                  # documentação do projeto (arquitetura, regras, glossário)
├── design/                # decisões de design (commit sheet da direção visual)
├── public/                # assets estáticos: fontes (.woff2/.ttf), imagens, logo
├── src/
│   ├── components/        # componentes reutilizáveis, um por pasta (index.tsx + styles.module.scss)
│   ├── data/              # dados comerciais estáticos: os 4 planos e seus textos
│   ├── hooks/             # estado da aplicação: useOrcamento, useConfig, useTheme
│   ├── pages/             # uma pasta por rota: Editor, Preview, History, Settings
│   ├── pdf/               # geração do PDF: documento colorido, documento P&B e páginas
│   │   ├── pages/         # páginas do PDF colorido
│   │   └── print/         # páginas do PDF preto e branco (árvore quase duplicada)
│   ├── storage/           # leitura/escrita no localStorage (config e histórico)
│   ├── styles/            # tokens, fontes e estilos globais (SCSS)
│   ├── types/             # contratos de domínio: Config, Orcamento, Totais
│   └── utils/             # domínio puro: cálculo dos totais e formatação de dinheiro
├── tests/
│   ├── setup.ts           # setup do Vitest
│   └── unit/              # testes unitários e de componente
├── index.html             # entrada do Vite
├── vite.config.ts         # Vite + configuração do Vitest
└── tsconfig*.json         # TypeScript em modo project references
```

Detalhamento de cada camada, fluxo de dados e dívidas técnicas: **[docs/ARQUITETURA.md](docs/ARQUITETURA.md)**.

## Fluxo do atendente

1. **Editor** (`/`) — preenche cliente, data, cidade/bairro, convidados (adultos, crianças 0–4, crianças 5–9), deslocamento e desconto. O estado é mantido em memória pelo `useOrcamento`.
2. **Preview** (`/preview`) — revisa o resumo do orçamento, vê o PDF renderizado e escolhe:
   - **Baixar PDF** (colorido) ou **PDF preto e branco**;
   - **Enviar no WhatsApp** (link `wa.me` com a mensagem do template);
   - **Salvar** no histórico.
3. **Histórico** (`/history`) — lista os orçamentos salvos por mês, com status, busca por cliente e ações de abrir, reenviar no WhatsApp, duplicar e excluir.
4. **Configurações** (`/settings`) — empresa, validade, padrões do editor, template de WhatsApp, preços dos planos, adicionais/pagamento, textos da capa e cardápio do PDF; exportar/importar a configuração em JSON e restaurar o padrão.

O orçamento **só é persistido quando o atendente clica em "Salvar"** no Preview. Tudo o mais (dados do editor e config) vive em memória ou no `localStorage` conforme abaixo.

## Onde ficam os dados

| Chave de `localStorage` | Conteúdo | Escrita | Leitura |
|---|---|---|---|
| `mana-config:v1` | Configuração da pizzaria (empresa, validade, preços, textos, cardápio) | `src/storage/config.ts`, a cada alteração em Configurações | ao abrir o app, com merge sobre o default |
| `mana-orcamentos:v1` | Histórico de orçamentos salvos, com os totais calculados no momento do salvamento | `src/storage/orcamentos.ts`, botão "Salvar" | telas de Histórico |
| `mana:theme` | Tema `dark` ou `light` | `src/hooks/useTheme.ts` | ao abrir o app |

Implicações práticas:

- O histórico **não é compartilhado entre atendentes nem entre navegadores**. Cada máquina tem o seu.
- Limpar os dados do site apaga config e histórico.
- A config é *mergeada* sobre `CONFIG_DEFAULT` na leitura, então uma config antiga ou parcial não quebra a tela.
- A config pode ser transportada manualmente via **Exportar/Importar JSON** na tela de Configurações.

## Documentação

- [docs/ARQUITETURA.md](docs/ARQUITETURA.md) — mapa de módulos, fluxo de dados e débitos técnicos.
- [docs/REGRAS-DE-NEGOCIO.md](docs/REGRAS-DE-NEGOCIO.md) — regras de cálculo, com fórmula e referência de código.
- [docs/GLOSSARIO.md](docs/GLOSSARIO.md) — vocabulário do domínio (plano, convidado equivalente, parcela etc.).
- [docs/PENDENCIAS-DE-PRODUTO.md](docs/PENDENCIAS-DE-PRODUTO.md) — decisões de produto ainda abertas com o cliente.
- [CLAUDE.md](CLAUDE.md) — convenções de código, comandos e regras que não devem ser alteradas sem o cliente.
- [PRODUCT.md](PRODUCT.md) — contexto de produto, usuários e princípios.

> Os documentos de `docs/` são entregues por issues separadas do epic PAMP-221. Se algum link acima ainda não resolver, ele está em um PR aberto — não recrie o arquivo.

## Convenções de contribuição

Leia o [CLAUDE.md](CLAUDE.md) antes de mexer no código: ele registra os comandos, o padrão de pasta de componente, como adicionar teste e **as regras de negócio que não podem ser "melhoradas" sem o cliente** (multiplicadores infantis, desconto à vista e validade).
