# Venda Ágil — Design System **v2**

Sistema de design do **Venda Ágil**, software de gestão de vendas para **representantes comerciais brasileiros**. O eixo do produto: **REPRESENTADA → CLIENTE → PEDIDO → FATURAMENTO → COMISSÃO.**

Esta é a **versão 2**: o DS v1 (projeto `bb4846ae-8341-4ed9-96f6-fbef93dfd266`) somado a todas as decisões tomadas na construção das ~80 telas hi-fi do produto (ago/2026). Nada do v1 foi apagado — os deltas estão registrados abaixo e em `tokens/v2-ajustes.css`.

> Leia primeiro: esta página → `tokens/v2-ajustes.css` → [`guidelines/fase-zero.md`](guidelines/fase-zero.md). O conceito visual **"Prancheta de Campo"** (plano · firme · anotado · direcional · parcimonioso) segue valendo integralmente.

---

## O QUE MUDOU NA V2 (decisões D-V2)

| # | Decisão | Substitui |
|---|---|---|
| **D-V2-01** | **Botão primário com conteúdo claro** `#F3F3F3` sobre o verde `#78A614` (4,6:1 — AA para texto 14px semibold). Pedido do dono do produto. | v1: texto navy sobre verde |
| **D-V2-02** | **Marcas de seleção brancas**: o check do checkbox e a bolinha do radio são `#FFFFFF` sobre o verde. Checkboxes/radios nativos têm recriação por CSS (ver v2-ajustes). | v1: marca navy |
| **D-V2-03** | **Ícone herda 1em do contexto** — regra global sobre `svg[data-lucide]`; ícone nunca estoura chip, tag ou botão. Lucide travada em `0.462.0`. | tamanho fixo 24px |
| **D-V2-04** | **VaSelect**: dropdown em `position:fixed`, nunca cortado por overflow; fecha ao rolar; abre para cima quando falta espaço. | Select nativo |
| **D-V2-05** | **Página sem scroll horizontal** (`overflow-x: clip`); scroll lateral só dentro de contêiner explícito (tabela larga). | — |
| **D-V2-06** | **Grids fluidos por variável** `var(--va-g2..g4)` + atributos `[data-va-kpis|cols|half|kanban]` que colapsam por media query. | — |
| **D-V2-07** | **Barras sticky** `[data-va-dock]` (rodapé de formulário) e `[data-va-bulk]` (ações em lote) sobem acima da navegação inferior no mobile (≤760px). | — |
| **D-V2-08** | **Kanban com containers**: etapa = superfície `#E9EDF3` raio 12; título com sublinhado 3px na cor da etapa (paleta fechada de 10, configurável); card com contorno inferior 3px na mesma cor; Perdidos vermelho, Ganhos verde-sucesso; "Fim da lista" no rodapé. | kanban de cards soltos |
| **D-V2-09** | **Tema escuro fora do produto** — decisão do dono. `tokens/theme-dark.css` permanece por compatibilidade, sem controle na UI. | — |
| **D-V2-10** | **Toast escuro**: fundo navy `#021226`, ícone `circle-check` em limão `#C3D91E`, canto inferior direito, ~2,6s. | — |

## PADRÕES NOVOS (nascidos nas telas)

- **Barra de ações em lote** — flutuante escura ao selecionar linhas: contagem + "limpar" + ações outline; destrutiva em vermelho claro por último. Componente `BulkActionsBar`.
- **Tabela-lista padrão** — card branco com grid por colunas, cabeçalho CAIXA ALTA 11px, coluna de checkbox 28px, hover `#FAFBFC`, linha clicável abre o detalhe, ação por linha só em ícone 32px. Larguras mínimas + `overflow-x:auto` no contêiner.
- **Botão Filtros** — um único botão com contador verde de filtros ativos abre painel com todos os selects; nunca selects soltos na barra.
- **Estado vazio por filtro** — ícone `search-x`, "Nenhum X com esses filtros", resumo do filtro ativo em negrito e "Limpar filtros".
- **Confirmação destrutiva com digitação** — exclusões irreversíveis exigem digitar `excluir`.
- **Modal "Sair sem salvar?"** — formulários longos interceptam o cancelar.
- **Chips de status com forma+cor** — círculo/triângulo/octógono antes da cor (daltonismo), padrão v1 mantido e estendido (ex.: tempo na etapa do CRM).

## COMPONENTES

Tudo do v1 (`core/`, `feedback/`, `layout/`, `data/`, `domain/` — ver cards) **mais** `components/v2/`:

### Inventário completo
- **core/** — Button (com ButtonGroup e SplitButton), Checkbox, Combobox, Field, Icon, IconButton, Input, Radio, SearchField, SegmentedControl, Select, Switch, Textarea
- **feedback/** — Alert, Badge, EmptyState, Skeleton, Tag, Toast, Tooltip
- **layout/** — Accordion, Avatar, Breadcrumb, Card, Drawer, Modal, Pagination, Stepper, Tabs, Timeline
- **data/** — BarChart, DataTable, DeltaValue, LineChart, MoneyValue, ProgressMeter, RecordRow, StatCard
- **domain/** — CommissionPanel, CustomerCard, DealCard, DiscountTierIndicator, GoalCard, NaturalLanguageFilter, OrderLineItem, OrderTotalsBar, ProductCard, RepresentadaSwitcher, StatusBadge, SyncIndicator
- **v2/** — VaSelect, BulkActionsBar, KanbanBoard

- **`VaSelect`** — select com dropdown sobreposto (D-V2-04).
- **`BulkActionsBar`** — barra de ações em lote.
- **`KanbanBoard`** — kanban com containers e cor por etapa (D-V2-08).

### Intentional additions
Os três componentes v2 não existem no v1; nasceram de padrões repetidos em 4+ telas dos protótipos e foram promovidos a componente conforme `guidelines/governanca.md`.

## UI KIT

As **~80 telas `.dc.html` do produto** vivem no projeto de origem, "Protótipos hi-fi em construção" — o UI kit vivo deste sistema: pedidos, clientes, produtos, tabelas de preço, transportadoras, cadastros auxiliares, CRM completo, catálogo B2B + loja mobile, financeiro, equipe, relatórios, configurações e conta.

## ICONOGRAFIA

Lucide `0.462.0` via CDN (`https://unpkg.com/lucide@0.462.0/dist/umd/lucide.min.js`), traço 1,75px, monocromático via `currentColor` + regra 1em (D-V2-03). Forma antes de cor nos status. Ícones de domínio: `guidelines/iconografia-dominio.md`. Sem emoji.

## ÍNDICE

```
styles.css                 entrada única (@imports) — inclui tokens/v2-ajustes.css por último
tokens/                    v1 completo + v2-ajustes.css (deltas D-V2)
components/                core · feedback · layout · data · domain (v1) + v2/ (novos)
guidelines/                fase-zero, decisões, acessibilidade, voz, governança + cards/ (specimens; v2-contraste.html)
assets/                    logotipos oficiais + referência estrutural
*.dc.html (raiz)           UI kit vivo — as telas do produto
adendos-prd-inventario.md  requisitos novos para PRD/inventário
SKILL.md                   invólucro Agent Skill
```

## FONTES / PENDÊNCIAS (herdadas do v1)

IBM Plex Sans + Plex Mono via Google Fonts (webfont auto-hospedada pendente); Lucide é substituição sinalizada caso exista set proprietário; fotos de produto reais pendentes.
