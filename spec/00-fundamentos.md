# Venda Ágil — Especificação 00 · Fundamentos

Base normativa para todas as telas. Os documentos de módulo (01-crm.md etc.) referenciam estes tokens e componentes — nada aqui é decorativo; tudo é regra.

---

## 1. Tokens visuais

### 1.1 Cores
| Token | Hex | Uso |
|---|---|---|
| `ink` | `#021226` | Texto principal, topbar, toasts, botão primário dark |
| `ink-soft` | `#454F5E` | Texto secundário, ícones de botões secundários |
| `ink-muted` | `#5B6678` | Labels, metadados |
| `ink-faint` | `#7A8699` | Placeholders, timestamps, texto terciário |
| `bg-page` | `#F2F4F7` | Fundo de página |
| `bg-raised` | `#FFFFFF` | Cards, modais, drawers |
| `bg-subtle` | `#FAFBFC` | Linhas alternadas, cabeçalhos internos |
| `bg-inset` | `#F7F9FB` | Fundo de threads de chat, painéis internos |
| `bg-chip` | `#EDF0F5` | Chips neutros, avatares |
| `border` | `#E4E8EF` | Divisores, bordas de card |
| `border-input` | `#CFD6E1` | Bordas de inputs e botões secundários |
| `border-soft` | `#EDF0F5` | Bordas internas fracas |
| `brand-green` | `#628A11` | Ação/seleção (borda ativa, ícones de ação) |
| `brand-green-dark` | `#365E10` | Links (`a`), hover de ação |
| `brand-green-bg` | `#F2F8D4` / `#F8FAF1` | Fundo de item selecionado |
| `brand-lime` | `#C3D91E` | Ícone de sucesso em toast |
| `focus-ring` | `rgba(120,166,20,.18)` | Anel de foco 3px |
| `blue` | `#176FBC` | Chat/branding do CRM (FAB, enviar), links informativos |
| `blue-dark` | `#0F5A9C` | Hover do azul |
| `blue-bg` | `#EAF4FD` / texto `#0C477B` | Badge "Aberto", chip de chat |
| `danger` | `#B3202F` | Erros, badges de não lidas, excluir |
| `danger-dark` | `#85202C` | Texto de badge vermelho |
| `danger-bg` | `#FDF0F1` | Fundo de badge/hover destrutivo |
| `success` | `#0E7D57` | Ganho, concluir, WhatsApp |
| `success-dark` | `#0A6244` | Texto de badge verde |
| `success-bg` | `#E8F7F0` / `#DDF3E4` | Fundo de badge/botão verde |
| `warn-text` | `#8A5B00` / `#5C4A0E` | Notas fixadas |
| `warn-bg` | `#FCF3DF` / borda `#F2D591` | Fundo de nota |
| Paleta categórica (etapas, avatares, tipos) | `#4A90D9 #8B5CB8 #D9822B #2AA1A8 #C2537A #628A11 #5B6ECC #B8860B #3E8E5A` | Sequencial por índice; Perdidos sempre `#B3202F`, Ganhos sempre `#0E7D57` |

Tinta 10% de uma cor categórica = cor + sufixo `1A` (ex.: `#176FBC1A`) para fundos de ícone de tipo.

### 1.2 Tipografia
Fonte única: **IBM Plex Sans** (fallback `system-ui, sans-serif`). Números tabulares (`font-variant-numeric: tabular-nums`) em valores, contadores e horários.

| Papel | Fonte |
|---|---|
| H1 página | 600 24px/1.25, letter-spacing −.01em |
| Título de seção/card | 600 16px/1.3 |
| Subtítulo de bloco | 600 14px/1.3 |
| Overline (rótulo de grupo) | 600 11px/1.2, caps, letter-spacing .06em, cor `ink-muted` |
| Corpo | 400 14px/1.55 |
| Corpo compacto | 400 13–13.5px/1.4–1.5 |
| Metadado | 400 12–12.5px/1.3 |
| Micro (badges) | 600 10.5–11px/1 |
| Inputs | **sempre ≥16px** (evita zoom automático no iOS) |

### 1.3 Raios, sombras, espaçamento
- Raios: inputs/botões 6px · cards internos 8px · cards kanban 10px · modais/painéis 10–14px · pills/avatares 999px.
- Sombras: card `0 1px 2px rgba(2,18,38,.06)` · popover `0 8px 24px rgba(2,18,38,.18)` · drawer `-12px 0 40px rgba(2,18,38,.25)` · FAB `0 6px 20px rgba(15,90,156,.45)` · toast `0 8px 24px rgba(2,18,38,.3)`.
- Escala de espaço: 4 / 6 / 8 / 10 / 12 / 14 / 16 / 20 / 24 / 32 / 40px. Gap padrão entre cards: 14px; entre seções de formulário: 14px; entre blocos de drawer: 24px.
- Layout de página: `main` com padding `44px 24px 56px 112px` (112px compensa a sidebar); largura máx. 1400px centrada quando o conteúdo é menor que a tela (ex.: Tarefas).

### 1.4 Ícones
Lucide (stroke 1.75). Tamanhos: 12–14px em chips/metadados, 15–18px em botões, 26px no FAB.

---

## 2. Breakpoints (6 faixas)

| Faixa | Largura | Regras estruturais |
|---|---|---|
| **XS — mobile pequeno** | 320–374px | Tudo de M + tipografia de títulos −2px; chips de filtro roláveis horizontalmente; grids sempre 1 coluna |
| **M — mobile** | 375–559px | Sidebar = bottom nav 4 itens + "Menu" (bottom sheet); busca do topbar vira ícone; botões do topbar 40×40px; modais e drawers = bottom sheet 100vw, altura máx. 92vh, raio superior 14px; formulários 1 coluna; teclas de atalho ocultas; toasts acima do bottom nav |
| **L — mobile grande/phablet** | 560–767px | Idem M, mas busca volta a campo; formulários de endereço em 2 linhas |
| **T — tablet** | 768–1023px | Sidebar compacta (ícones); drawers laterais com `width: min(spec, 100vw)`; kanbans com scroll horizontal; grids 2 colunas |
| **D — notebook/desktop** | 1024–1439px | Layout completo; drawer do negócio 980px; grids `auto-fit minmax(300–320px, 1fr)` |
| **XL — desktop grande** | ≥1440px | Conteúdo limitado a 1400px centrado; kanbans centralizam colunas (`width:max-content; margin:0 auto` dentro do scroll) |

Breakpoint primário do código: `--break-mobile: 768px`. Interações touch (`pointer: coarse`): alvos ≥44×44px, hovers têm equivalente em toque (primeiro toque = hover não se aplica; ações são diretas).

---

## 3. Componentes globais — estados obrigatórios

### 3.1 Botões (design system `VendaGilDesignSystem`)
| Estado | Primário | Secundário |
|---|---|---|
| Normal | fundo `ink`, texto `#F3F3F3` | fundo branco, borda `border-input`, texto `ink-soft` |
| Hover | escurece 6% | borda `brand-green`, texto `brand-green-dark` |
| Focus | anel `focus-ring` 3px | idem |
| Disabled | opacidade .5, cursor default, sem hover | idem |
| Loading | spinner 14px no lugar do ícone, texto mantido, clique ignorado | idem |
Tamanhos: sm 32px, md 40px. Ícone à esquerda 14–16px, gap 6–8px.

### 3.2 Inputs
- Altura 40–44px, borda `border-input`, raio 6px, padding-x 10–12px, fonte ≥16px.
- Focus: borda `#78A614` + anel `focus-ring`. Erro: borda `danger`, mensagem 12.5px `danger-dark` abaixo, ícone opcional. Disabled: fundo `bg-chip`, texto `ink-faint`.
- Máscaras BR: CNPJ `00.000.000/0000-00`, CPF, CEP `00000-000`, telefone `(00) 00000-0000`, moeda `R$ 1.234,56` (vírgula decimal), data `dd/mm/aaaa`.
- Validação: no blur do campo + no submit; mensagem específica por regra ("Informe o título", "CNPJ inválido"). Submit com erros: foca o primeiro campo inválido, rola até ele, não limpa nada.

### 3.3 Modais
- Overlay `rgba(2,18,38,.45)`; clique no overlay e tecla Esc fecham (exceto quando há alterações não salvas → confirmação "Descartar alterações?" com Descartar/Continuar editando).
- md ≈ 560–640px; conteúdo interno nunca gera scroll horizontal (`max-width:100%`, grids `auto-fit`).
- ≤767px: bottom sheet.
- Foco preso dentro do modal; ao fechar, foco volta ao elemento que abriu.

### 3.4 Drawers (barras laterais)
- Desktop: fixo à direita, altura 100vh, overlay igual ao modal; Esc e overlay fecham. ≤767px: bottom sheet.
- Larguras: padrão 480px; NegocioDrawer 980px (`min(980px,100vw)`).

### 3.5 Toasts
- Posição: fixo, canto inferior direito, 24px das bordas; fundo `ink`, texto `#F3F3F3`, ícone `circle-check` em `brand-lime`, raio 10px, padding 12×16px.
- Duração 2,6s; um por vez (novo substitui). Com chat aberto: `right` desloca para 470px (janela) ou 96px (só FAB). Mobile: acima do bottom nav.
- Toast de erro: ícone `circle-alert` em `#E4B7BC`, mesma duração.

### 3.6 Tabelas e listas
- Tabelas largas: `min-width` interna + `overflow-x:auto` **dentro do card** (a página nunca rola horizontalmente).
- Ordenação: clique no cabeçalho alterna asc/desc (seta indica); uma coluna por vez.
- Paginação: 25 linhas/página, controles ‹ 1 2 3 › + "x–y de z"; filtros resetam para página 1.
- Busca em listas: filtra na digitação (debounce 300ms), case/acento-insensível, sobre os campos indicados na spec da tela.
- Estado vazio: ilustração leve/ícone + frase específica + ação primária ("Nenhum cliente encontrado — Limpar filtros" quando é resultado de filtro; CTA de criação quando a base é vazia).
- Loading: skeleton (blocos `bg-chip` pulsando) na primeira carga; spinner inline em recarga por filtro.
- Erro de carga: banner no lugar da lista com "Não foi possível carregar" + botão Tentar novamente.

### 3.7 Menus suspensos / popovers
- Sombra popover, raio 8–10px, item 40px, hover `bg-subtle`/`brand-green-bg`; clique fora ou Esc fecha; item atual com check `brand-green`.

### 3.8 Confirmações destrutivas
Toda exclusão pede confirmação em modal: título "Excluir {item}?", texto de consequência, botões **Cancelar** (secundário) e **Excluir** (fundo `danger`, texto branco). Após confirmar: toast "{Item} excluído". Exceções (sem modal, ação reversível na hora): remover anexo, desmarcar tarefa — com toast informando.

---

## 4. Permissões (papéis)

| Papel | Pode |
|---|---|
| **Administrador** | Tudo, inclusive plano, usuários, permissões |
| **Gestor** | Tudo operacional + aprovações, metas, comissões, config. do CRM; não altera plano/usuários |
| **Vendedor** | Sua carteira: clientes, pedidos, negócios, conversas e tarefas próprios; sem acesso a comissões de terceiros, aprovações, configurações |
| **Financeiro** | Faturamento, contas a receber, comissões; leitura em pedidos |

- Tarefas: matriz por vendedor (Visualizar/Criar/Editar/Excluir) definida em Configurações do CRM › Tarefas. Sem Visualizar → item "Tarefas" some do menu. Editar/Excluir valem apenas para tarefas do próprio vendedor; gestor edita/exclui qualquer uma.
- Elemento sem permissão: **oculto** quando é módulo/menu; **desabilitado com tooltip** "Sem permissão — fale com seu gestor" quando é ação dentro de tela visível.

---

## 5. Navegação global

### 5.1 Topbar (64px, fundo `ink`)
- **Logo** → `inicio.dc.html`.
- **Busca global** (campo 320px): Enter/clique em resultado navega; dropdown agrupado (Clientes/Pedidos/Produtos, 5 por grupo, "ver todos" por grupo); vazio: "Nada encontrado para '{termo}'". ≤560px vira ícone 40px que expande campo full-width sobreposto (X fecha).
- **Sino**: badge = tarefas de hoje+atrasadas abertas + avisos não lidos. Popover 380px: seção Tarefas (checkbox conclui/reabre na hora — ver 01-crm §4), link "Ver todas as tarefas", divisor, seção Avisos (clique navega). Vazio: "Sem notificações por aqui".
- **Avatar/menu**: Perfil, Plano, Sair (Sair → `entrar.dc.html`, encerra sessão).

### 5.2 Sidebar (72px, expandida 240px em hover/desktop)
Ordem: Início · Pedidos · Cadastros · Financeiro · Equipe · CRM · Relatórios · Configurações. Grupos abrem submenu; item ativo: barra 3px `brand-green` + fundo `bg-chip`. Badge numérico em Conversas. ≤767px: bottom nav com Início, Pedidos, CRM, Relatórios + **Menu** (bottom sheet com todos os grupos).

### 5.3 Chat global (`va-chat.js`) — ver 01-crm §5.

---

## 6. Feedback padrão por ação
| Ação | Feedback |
|---|---|
| Criar registro | Toast "{Item} criado(a)" + fechamento do modal + item visível na lista |
| Salvar edição | Toast "Alterações salvas" |
| Excluir | Modal de confirmação → toast "{Item} excluído(a)" |
| Mover (etapa/funil/coluna) | Toast "Movido para {destino}" |
| Ação em massa | Toast "{n} itens {ação}" |
| Falha de rede | Toast de erro "Não foi possível concluir — tente novamente", estado anterior preservado |
