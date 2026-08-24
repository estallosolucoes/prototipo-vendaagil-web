# Venda Ágil — Especificação 01 · CRM

Cobre: Negócios, Contatos, Conversas, Tarefas, Templates, Configurações do CRM, barra lateral do negócio (NegocioDrawer) e chat global. Tokens, estados de componentes, breakpoints e permissões: ver `00-fundamentos.md` (referenciado como §F).

---

## 1. Negócios (`crm-negocios.dc.html`)

### 1.1 Layout
- Página padrão (§F 1.3). H1 "Negócios" + subtítulo com contagem de negócios em aberto.
- Barra de controles: seletor de funil (segmented), busca, botão Filtros (contador de filtros ativos), botão primário "Novo negócio".
- Kanban: colunas de 296px, gap 14px, fundo `#E9EDF3`, raio 12px, padding 10px, scroll horizontal do container (não da página). Cabeçalho de coluna: nome 600 13.5px + soma dos valores + linha 3px na cor da etapa.

### 1.2 Card do negócio
Estrutura (fundo branco, raio 10px, sombra card, borda inferior 3px na cor da etapa, padding 12×14px):
1. Título 600 14px + valor tabular à direita.
2. Cliente 400 12.5px `ink-muted`.
3. Etiquetas (pills §F 1.1, máx. 3 visíveis + "+n").
4. Rodapé: avatar-sigla do responsável 24px · próximo passo 400 12px `ink-faint` (flex:1) · **balão de chat** 28px.

Ações no card:
| Elemento | Clique |
|---|---|
| Card (área geral) | Abre o NegocioDrawer (§6) com este negócio selecionado |
| Balão de chat 28px (fundo `blue-bg`, ícone 15px `blue`; hover `#CDE5FA`) | `stopPropagation`; abre o chat global (§5) com o cliente do card: se já existe conversa, zera não lidas e abre; senão cria conversa nova com divisor "hoje" + linha de sistema "Negócio: {título}" |
| Arrastar card (desktop) | Move entre colunas = mudar etapa; solta → toast "Movido para {etapa}"; colunas Perdidos exigem motivo (modal §1.3) |

Estados do card: hover (sombra popover leve, cursor pointer), arrastando (opacidade .7, placeholder tracejado na origem), ganho/perdido (badge no lugar do próximo passo).

### 1.3 Perder negócio
Modal "Marcar como perdido": select obrigatório **Motivo da perda** (opções cadastradas em §8, aba Motivos), textarea opcional "Detalhes". Confirmar → card vai à coluna Perdidos, toast "Negócio marcado como perdido". Cancelar → nada muda.

### 1.4 Filtros
Painel (popover 320px): Responsável (multi-select), Etiquetas (chips multi), Valor (faixa min–max, moeda), Prazo (Sem prazo / Atrasados / Esta semana). Regras: filtros combinam por **E**; dentro de um filtro multi, opções combinam por **OU**. Aplicar fecha o painel e mostra contador no botão ("Filtros · 2"); Limpar remove todos. A busca (campo) filtra por título do negócio e nome do cliente, combinando por E com os demais.

### 1.5 Breakpoints
- T (768–1023): colunas 280px; painel de filtros vira bottom sheet.
- M/L (≤767): colunas 85vw com scroll-snap; "Novo negócio" vira FAB não (usa botão full-width sob o título); busca full-width.
- XS: idem M; título 22px.

---

## 2. Contatos (`crm-contatos.dc.html`, `crm-contato-detalhe.dc.html`)

- Lista: busca (nome, empresa, telefone, e-mail — §F 3.6), tabela paginada (§F 3.6) com Nome, Empresa, Cargo, Telefone/WhatsApp, E-mail, Último contato. Linha → detalhe.
- Detalhe: cabeçalho com avatar, nome, empresa (link → cliente-360), ações **WhatsApp** (abre chat global §5 com o contato) e **Editar**. Abas: Dados (formulário §F 3.2 — nome*, empresa, cargo, telefone com máscara, e-mail com validação de formato), Negócios (cards resumidos → NegocioDrawer), Conversas (histórico, clique abre §3 com a conversa ativa).
- "Novo contato": modal com os mesmos campos; salvar → toast, contato no topo da lista.

---

## 3. Conversas (`crm-conversas.dc.html`)

### 3.1 Layout
Duas colunas: lista 320px (fixa) + thread flex:1. ≤767px: só uma visível por vez — lista → clique abre thread full-screen com botão voltar.

### 3.2 Lista de conversas
Item 64px: avatar-sigla 40px, nome 600 14px, prévia da última mensagem 400 12.5px `ink-faint` truncada, horário, badge de não lidas (pill `danger`). Ativa: fundo `brand-green-bg` + barra 3px. Ordenação: última mensagem desc. Busca no topo filtra por nome do cliente/contato.

### 3.3 Cabeçalho da thread
`flex-wrap` (quebra em 2 linhas quando estreito). Elementos:
| Elemento | Comportamento |
|---|---|
| Avatar + nome + canal ("WhatsApp · {instância}" 12px verde) | — |
| **Ver cliente** (btn secundário sm) | → `cliente-360.dc.html` |
| **Negócios** (btn secundário sm, ícone kanban) | Abre o NegocioDrawer (§6) do cliente da conversa |
| **Botão de nota** 32px (ícone sticky-note; hover fundo `warn-bg`) | Alterna o formulário de nota (§3.4) |
| **Emitir pedido** (btn primário sm) | → `pedidos-novo.dc.html` com o cliente pré-selecionado |

### 3.4 Nota da conversa
- Formulário inline (faixa `#FFFDF5`, borda inferior `#F2D591`): input 16px + **Salvar nota** + X (cancela sem salvar).
- Salvar: nota substitui a anterior (1 nota por conversa), toast "Nota salva e fixada no topo".
- **Fixada (padrão)**: card sticky no topo da thread (fundo `warn-bg`, borda `#F2D591`, ícone pin, sombra leve). Botão **pin-off** → desafixa: toast "Nota desafixada — ela fica no fim da conversa"; nota vira card tracejado centralizado ao fim da thread com botão **pin** (refixar → toast).
- Nota vazia salva = remove a nota.

### 3.5 Thread
Fundo `bg-inset`, padding 20px, gap 10px. Divisores de data centrados (pill `bg-chip`). Bolhas: recebidas à esquerda (branco, borda `border`), enviadas à direita (`#CDE5FA`, borda `#9CCBF5`); raio 12px com canto "seta" 4px; horário 10.5px dentro da bolha; máx. 78% de largura. Auto-scroll para o fim ao abrir e ao enviar/receber.

### 3.6 Composer
Linha de 6 controles + botão Enviar (gap 6px, botões 40×40px §F 3.1):
| Controle | Clique |
|---|---|
| **Anexo** (paperclip) | Popover com Catálogo / Pedido / Tabela de preços → anexa card do documento na conversa |
| **Imagem** | Seletor de arquivo `image/*`; envia bolha "Imagem: {nome} ({tamanho})" (real: preview da imagem) |
| **Áudio** (mic) | Pressionar grava (real); no protótipo: envia bolha "Áudio · 0:12" |
| Campo de texto | Placeholder "Escreva a mensagem — digite / para inserir um modelo"; `/` abre popover de templates (§7): filtragem pelo texto após a barra, Enter insere com variáveis resolvidas; Enter envia; Shift+Enter quebra linha |
| **Emoji** (smile) | Popover com grid de emojis; clique insere no cursor e fecha |
| **Agendar** (calendar-clock) | Popover "Agendar mensagem": Hoje 18:00 · Amanhã 08:00 · Escolher data e hora (abre date-time picker). Exige texto no campo — sem texto: toast "Escreva a mensagem antes de agendar". Confirmado: campo limpa, toast "Mensagem agendada — {quando}"; mensagem aparece na thread com badge "agendada" e pode ser cancelada até o horário |
| **Enviar** (primário) | Envia texto; desabilitado com campo vazio |

Somente um popover aberto por vez (abrir um fecha os outros). Esc/clique fora fecha.

### 3.7 Breakpoints
- T: lista 280px. M/L: uma coluna (§3.1); cabeçalho em 2 linhas; composer mantém todos os ícones (40px são alvo mínimo); popovers viram bottom sheet. XS: ícones de imagem/áudio colapsam num "+" único que abre menu.

---

## 4. Tarefas (`crm-tarefas.dc.html`)

### 4.1 Layout
`main` máx. 1400px centrado. Cabeçalho: H1 "Tarefas" + subtítulo "{n} tarefas em aberto · tipos e permissões em Configurações do CRM"; à direita **Tipos de tarefa** (secundário) e **Nova tarefa** (primário).

### 4.2 Filtros (linha única, wrap)
| Filtro | Opções | Regra |
|---|---|---|
| Período (segmented no card branco) | Todas · Hoje · Essa semana · Personalizado | Hoje: `data = hoje`. Essa semana: segunda–domingo corrente. Personalizado: mostra 2 date-inputs "de/até" (default: semana corrente); limites inclusivos; um lado vazio = aberto |
| **Minhas tarefas** (chip toggle, ícone user) | on/off | `responsável = usuário logado` |
| Status (chips à direita) | Todos os status · Abertas · Atrasadas · Concluídas | Abertas: `!feita`. Atrasadas: `!feita && data < hoje`. Concluídas: `feita` |

Todos combinam por **E**. Ativo: chip com borda `ink` + fundo `bg-chip` (§F 3.1). Filtros não persistem entre sessões.

### 4.3 Kanban (4 colunas fixas)
Colunas 296px, gap 14px; wrapper `width:max-content; margin:0 auto` dentro de container com `overflow-x:auto` (centraliza quando cabe; scroll alcança tudo quando não cabe).

| Coluna | Cor | Critério (derivado, não editável por drag) |
|---|---|---|
| Atrasadas | `#B3202F` | `!feita && data < hoje` |
| Hoje | `#D9822B` | `!feita && data = hoje` |
| A fazer | `#4A90D9` | `!feita && data > hoje` |
| Concluídas | `#0E7D57` | `feita` |

Cabeçalho: nome + "n tarefas" + linha 3px. Coluna vazia: card tracejado "Nenhuma tarefa aqui". Ordenação interna: data+hora asc.

### 4.4 Card de tarefa
1. Linha 1: ícone do tipo 26px (cor do tipo sobre tinta 10%) + nome do tipo 600 11.5px + horário à direita ("Hoje · 09:30"; atrasada: 600 `danger-dark` com data "16/08 · 10:00").
2. Título 600 14px (concluída: riscado `ink-faint`, card opacidade .75).
3. Chip do negócio vinculado (se houver): pill `bg-chip`, ícone kanban. **Clique → abre o NegocioDrawer (§6) com o negócio e cliente da tarefa — não navega.**
4. Rodapé: avatar-sigla 24px + cliente truncado + **Concluir** (pill; hover verde) ou **Reabrir** (pill; concluídas).

Concluir: `feita=true`, card move para Concluídas, toast "Tarefa concluída — boa!", sino atualiza. Reabrir: `feita=false`, volta à coluna pela data, toast "Tarefa reaberta".

### 4.5 Modal Nova tarefa
Sem scroll horizontal em nenhuma largura (grid `auto-fit minmax(220px,1fr)`). Campos:
| Campo | Tipo | Regras |
|---|---|---|
| Título* | input 16px | Obrigatório; vazio mantém "Criar tarefa" desabilitado |
| Tipo | chips (um ativo) | Default: primeiro tipo; ativo = borda+fundo na cor do tipo |
| Data | date | Default hoje |
| Hora | time, 96px fixo | Default 09:00 |
| **Vincular a um negócio** | busca com autocomplete | Placeholder "Buscar por negócio"; ícone lupa; digita → sugestões (máx. 6) por nome do negócio **ou** cliente (case/acento-insensível); item: nome + cliente; clique preenche e fecha; X remove o vínculo; sem resultado: "Nenhum negócio encontrado"; campo vazio = sem vínculo (permitido) |
| Responsável | select | Default: usuário logado |
| Descrição | textarea 2 linhas | Opcional |

Criar → tarefa no kanban (coluna pela data), toast "Tarefa criada", modal fecha e limpa. Cancelar/Esc/overlay: fecha sem salvar (com alterações: confirmação §F 3.3).

### 4.6 Modal Tipos de tarefa
- Lista: chip do ícone 32px na cor + nome + "{n} tarefas"/"sem tarefas" + lixeira (hover vermelho). Excluir: sem modal (tipo não apaga tarefas antigas — elas mantêm nome/ícone gravados); toast explica.
- Novo tipo (painel `bg-inset`): Nome* + grade de ícones (15 opções Lucide, 38px, selecionado tinge na cor escolhida) + 10 cores (26px, selecionada com anel duplo). "Adicionar tipo" desabilitado sem nome; cria → aparece na lista e nos chips do modal Nova tarefa, toast.

### 4.7 Dados
Store `va-tarefas.js` (localStorage `va-tarefas-v1`): única fonte para kanban, sino (§F 5.1) e criação via NegocioDrawer. Toda mutação notifica assinantes (páginas abertas re-renderizam).

### 4.8 Breakpoints
T: colunas 280px. M/L: colunas 85vw + scroll-snap; filtros em 2 linhas (períodos roláveis); modais bottom sheet. XS: chips de status roláveis.

---

## 5. Chat global (`va-chat.js`, todas as páginas)

### 5.1 Aparição do FAB
FAB 56px azul `blue` (hover `blue-dark`), fixo 24px do canto inferior direito, z-index 620. **Só existe se** houver ≥1 conversa ativa, criada por: (a) mensagem recebida de cliente, ou (b) clique no balão do card do negócio / ação "conversar" em outra tela. Badge `danger` com total de não lidas (borda 2px `bg-page`). Fechar/finalizar a última conversa remove o FAB.

### 5.2 Dock aberto
Clique no FAB abre janela 380×560px (máx. `100vw−90px` × `100vh−100px`) colada ao rodapé, raio superior 14px + **trilho de avatares** à esquerda (44px, cor por conversa, anel branco+azul na ativa, badge de não lidas por conversa; clique troca a conversa ativa e zera as não lidas dela).

Janela: cabeçalho (avatar, nome, "WhatsApp · {canal}", **Finalizar** — pill verde, encerra e remove a conversa com toast "Conversa finalizada e registrada no histórico" —, **minimizar** — volta ao FAB — e **X** — fecha a conversa sem finalizar); corpo com bolhas (§3.5, versão compacta); composer: "+" anexo (toast no protótipo), mic, campo 16px (Enter envia), emoji, enviar 38px azul. Conversa sem mensagens: "Envie a primeira mensagem para {nome} pelo WhatsApp."

### 5.3 Persistência e simulação
localStorage `va-chat-v1`: conversas, não lidas, aberto/minimizado — sobrevive à navegação. Protótipo: 4s após o primeiro carregamento, "Depósito São Jorge" envia 1 mensagem (uma única vez) para demonstrar a condição (a).

### 5.4 Breakpoints
≤560px: janela 100vw−16px; trilho sobrepõe à esquerda; FAB 56px mantém (alvo ≥44px).

---

## 6. Barra lateral do negócio (`NegocioDrawer.dc.html`)

Componente único — **obrigatório** que Negócios, Conversas e Tarefas usem o mesmo (props: open, onClose, cliente, contato, negocio, valor, etapa, funil).

### 6.1 Estrutura
Drawer direito `min(980px,100vw)`, overlay §F 3.4.

**Cabeçalho** (padding 14×20px, wrap): título "Negócios — {cliente}" · botão **MOVER ENTRE FUNIS** (§6.3) · spacer · resumo "{contato} · {n} negócios · {m} em aberto" · X fecha.

**Faixa de etapas** (padding 16×32px, fundo `bg-subtle`, scroll-x): setas encadeadas (§6.2).

**Corpo** (padding 32px, grid `auto-fit minmax(320px,1fr)` gap 40px):
- Coluna A (gap 24px): menu NEGÓCIOS DO CLIENTE (§6.4) · resumo do selecionado (título · funil › etapa, valor 600 22px, info, etiquetas) · ações **Criar pedido** (→ `pedidos-novo` com cliente/negócio) / **Abrir conversa** (abre chat global §5 com o cliente) / **Criar tarefa** (§6.5) · **Registrar interação** (§6.6).
- Coluna B (gap 24px): **Pedidos vinculados** (item 40px → `pedido-detalhe`) · **Anexos** (§6.7) · **Histórico** (timeline: ícone 28px + texto 500 13.5px + quando 400 12px).

### 6.2 Etapas (setas)
- Forma: clip-path de seta (recorte 14px), altura 52px, padding-x 30px, **largura = conteúdo** (`width:max-content` — nome nunca trunca), sobreposição −12px.
- Cores: paleta categórica por índice; Perdidos/Não resolvido `danger`; Ganhos/Resolvido `success`. Etapa atual: fundo sólido, texto branco 700 11.5px + selo "etapa atual"; demais: cor a 25% (`+40` alpha), texto na cor 600.
- Clique em etapa ≠ atual: move o negócio, toast "Negócio movido para {etapa}". Clique na atual: nada.

### 6.3 MOVER ENTRE FUNIS
Botão outline 30px, caps 11px, ícones arrow-right-left + chevron. Abre menu (220px, §F 3.7) com os funis; atual marcado com check verde. Selecionar outro: negócio vai para a **1ª etapa** do funil destino, faixa de etapas re-renderiza, toast "Negócio movido para o funil {funil} — etapa {etapa}". Funis: Venda (11 etapas), Acompanhamento (5), Lista de espera (6), SAC/Cobrança (4) — cadastrados em §8.

### 6.4 NEGÓCIOS DO CLIENTE (menu suspenso)
Botão-linha (fundo `bg-subtle`, borda): overline "NEGÓCIOS DO CLIENTE" + contador pill + chevron (gira 180° aberto). **Fechado por padrão.** Aberto: lista de todos os negócios do cliente — abertos e fechados — item com título, "funil › etapa", valor tabular, badge de status (Aberto azul / Ganho verde / Perdido vermelho). Selecionar: item ganha borda+fundo verdes, drawer inteiro (etapas, resumo, ações) passa a refletir o negócio escolhido, menu fecha.

### 6.5 Criar tarefa (inline)
Botão alterna painel `bg-inset`: input Título* 16px + date (default hoje) + **Criar tarefa** (desabilitado sem título). Criar: tarefa no store §4.7 vinculada ao negócio e cliente atuais, painel fecha e limpa, toast "Tarefa criada e vinculada ao negócio". Nota: "A tarefa aparece no módulo Tarefas e nas notificações do dia."

### 6.6 Registrar interação
Chips Visita/Ligação/WhatsApp/E-mail (um ativo, §F chips) + textarea 2 linhas + **Registrar interação**. Registrar: entrada no Histórico com ícone do tipo, textarea limpa, toast "{Tipo} registrada no histórico".

### 6.7 Anexos
**Anexar arquivo** abre o seletor nativo (múltiplos). Cada arquivo vira item: ícone (image p/ imagens, file-text demais), nome truncado, meta "{tipo} · {tamanho} KB · agora". Toast "Arquivo anexado ao negócio" (ou "{n} arquivos anexados"). Lixeira remove direto (sem modal) + toast "Anexo removido do negócio".

### 6.8 Breakpoints
D/XL: 980px, 2 colunas. T: `100vw`, 2→1 coluna conforme `minmax`. M/L: bottom sheet full-width, 1 coluna, faixa de etapas mantém scroll-x, cabeçalho em 2 linhas. XS: idem; botão MOVER ENTRE FUNIS abaixo do título.

---

## 7. Templates (`crm-templates.dc.html`, `crm-template-novo.dc.html`)
- Lista: nome, prévia, canal, usos; ações editar/duplicar/excluir (§F 3.8).
- Novo/editar: Nome*, Conteúdo* com variáveis `{{cliente}} {{vendedor}} {{empresa}}` (menu de inserção), prévia resolvida ao lado. Salvar → toast; template disponível no composer via "/" (§3.6).

## 8. Configurações do CRM (`crm-configuracoes.dc.html`)
Abas: **Funis** (CRUD de funis e etapas: nome, ordem por arrastar, cor; excluir etapa com negócios exige mover antes) · **Motivos de perda** (lista + novo; usados no modal §1.3) · **Etiquetas** (nome+cor) · **Tarefas** (§8.1) · **Modelos de mensagem** (atalho para §7) · **Automações e WhatsApp**.

### 8.1 Aba Tarefas — permissões
Tabela: coluna Vendedor (avatar+nome, min 560px com scroll interno §F 3.6) + 4 colunas de 92px com switches **Visualizar · Criar · Editar · Excluir**. Toggle salva imediatamente (real: PATCH; sem botão salvar) — sem confirmação; efeito descrito em §F 4. Rodapé explicativo fixo.

---

## 9. Notificações de tarefas no sino (Topbar)
Seção "TAREFAS DE HOJE E ATRASADAS" lista tarefas com `status ∈ {hoje, atrasada}` (+ as concluídas nesta sessão do popover, para permitir desfazer). Item: checkbox 18px (marcar → conclui no store, título fica riscado; desmarcar → reabre) · título · "{cliente} · {data se atrasada} {hora}" · badge "atrasada" · ícone do tipo 26px. Link "Ver todas as tarefas" → módulo §4. Some quando não há tarefas de hoje/atrasadas.
