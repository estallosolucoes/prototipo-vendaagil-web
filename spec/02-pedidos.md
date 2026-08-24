# Venda Ágil — Especificação 02 · Pedidos

Telas: `pedidos.dc.html` (lista), `pedidos-novo.dc.html` (emissão), `pedido-detalhe.dc.html`, `pedido-editar.dc.html`, `pedidos-aprovacoes.dc.html`. Fundamentos: §F (`00-fundamentos.md`).

---

## 1. Lista de pedidos (`pedidos.dc.html`, PED-01)

### 1.1 Layout
`main` máx. 1440px centrado, padding §F 1.3. Cabeçalho: H1 "Pedidos" + subtítulo dinâmico "Mostrando **{período}** em **{representadas}** · link '{n} aguardando aprovação'" (→ aprovações §5). À direita, 4 botões-ferramenta 40px + **Emitir pedido** (primário).

### 1.2 Ferramentas do cabeçalho
| Botão | Comportamento |
|---|---|
| **Período** (calendar + rótulo atual + chevron) | Popover 200px com: Hoje · Ontem · Últimos 7 dias · Este mês (default) · Mês passado · Personalizado… (abre range de datas). Selecionado: fundo `brand-green-bg` 600. Escolher fecha o popover, atualiza subtítulo, KPIs e lista |
| **Filtros** | Abre drawer "Filtros avançados" (§1.5) |
| **Exportar** | Modal sm "Exportar pedidos": select Formato (Excel .xlsx default / PDF), checkboxes "Incluir itens de cada pedido" (off) e "Incluir comissão prevista" (on). Botão "Exportar {n} pedidos" (n = resultado filtrado atual) → download + fecha. Cancelar fecha |
| **Colunas** | Popover 264px "Mostrar e ordenar colunas": lista das 7 colunas (Nº, Cliente, Representada, Data, Total, Comissão, Situação) com checkbox (mostrar/ocultar) e alça de arrastar (grip) para reordenar — drag muda a ordem da tabela em tempo real; rodapé "Arraste para mudar a ordem da tabela". Persistência por usuário |
| **Emitir pedido** (primário) | → `pedidos-novo.dc.html` |

Um popover aberto por vez; clique fora/Esc fecha.

### 1.3 KPIs (grid 4 colunas, gap 16px)
Pedidos (contagem) · Valor emitido · Orçamentos (contagem · valor) · Comissão prevista (verde `brand-green-dark`). Sempre refletem o período+filtros vigentes. Sem clique (informativos).

### 1.4 Lista agrupada por dia
Grupos com overline "Hoje — quarta, 05/08" / "Ontem — …" / "{dia}, {data}". Cada grupo é um card branco com linhas de `min-width:820px` (scroll-x interno §F 3.6).

Linha (56px, hover `bg-subtle`, cursor pointer):
| Elemento | Comportamento |
|---|---|
| Checkbox 18px (accent `#78A614`) | `stopPropagation`; seleciona para ações em massa (§1.6) |
| Nº (mono 600) · Cliente 600 14px + meta "Representada · hora · vendedor · condição" | — |
| StatusBadge (pedido / orcamento / separacao / faturado_parcial / entregue / cancelado) | — |
| Valor + "com. {comissão}" (verde; cancelado mostra "—") | — |
| Ícone prévia (panel-right-open, 32px; hover `bg-chip`) | `stopPropagation`; abre drawer de prévia (§1.7) |
| Clique na linha | → `pedido-detalhe.dc.html` do pedido |

Estado vazio (quando filtros zeram o resultado): card central com ícone search-x 56px, título "Nenhum pedido com esses filtros", texto citando o período ativo e botão **Limpar filtros** (restaura Este mês e remove filtros).

### 1.5 Drawer Filtros avançados
Selects: Representada, Estágio (Emissão/Separação/Faturamento/Entrega), Situação (Pedido/Orçamento/Cancelado), Vendedor, Origem (Emitido no sistema/Catálogo B2B), Transportadora — todos com opção "Todas/Todos" (default). Valor mínimo/máximo (2 colunas, prefixo R$, numérico). Rodapé: **Limpar filtros** (reseta e fecha) e **Aplicar filtros** (aplica à lista+KPIs, fecha, botão Filtros ganha contador). Combinação: E entre filtros; período do §1.2 soma-se por E.

### 1.6 Barra de ações em massa
Aparece fixa no rodapé-centro (fundo `ink`, raio 10px) quando ≥1 selecionado: "{n} pedido(s) selecionado(s)" + **limpar** (desmarca tudo) + divisor + **Imprimir** (gera PDF único → toast "PDF com {n} pedidos gerado para impressão") + **Exportar** (Excel → toast) + **Alterar situação** (aplica em massa → toast) + **Excluir** (texto rosa; confirmação §F 3.8 → toast "{n} pedidos excluídos", seleção limpa). Mobile: `max-width:calc(100vw-32px)`, quebra em 2 linhas.

### 1.7 Drawer de prévia do pedido
Título "Pedido {nº} · {cliente}", subtítulo meta. Conteúdo: StatusBadge + valor 18px; ITENS (linhas nome × total); Condição e Comissão prevista; botão **Abrir pedido completo** → detalhe. Fecha por X/overlay/Esc.

### 1.8 Breakpoints
D/XL: grid completo. T: KPIs 2×2; ferramentas quebram linha. M/L: KPIs 1 coluna; linha de pedido rola no card; barra em massa empilha; drawers viram bottom sheet. XS: idem, H1 22px.

---

## 2. Emissão de pedido (`pedidos-novo.dc.html`, PED-02)

### 2.1 Estrutura
Breadcrumb "Pedidos › Novo pedido". Direita do H1: indicador "Rascunho salvo às {hh:mm}" (autosave a cada alteração relevante, verde com check) + **Salvar como orçamento** (ghost) + **Pré-visualizar** (secundário, abre o PDF em nova aba).

**Barra de contexto** (card horizontal): avatar-sigla do cliente + nome + "CNPJ · cidade/UF · rota"; divisor; colunas Representada / Tabela de preço / Condição / Vendedor; badge "Rascunho"; **Alterar contexto** (ghost sm) → modal §2.7.

### 2.2 Cliente bloqueado (variação `?bloqueado=1`)
Banner vermelho (borda `#EFA4AD`, fundo `danger-bg`): título "Este cliente está bloqueado por {n} títulos vencidos há mais de 30 dias", texto explicando que só pode salvar orçamento ou pedir liberação. Ações: **Ver títulos vencidos** (→ contas-receber) e **Pedir liberação ao gestor** (após clique vira "Liberação pedida ao gestor", desabilitado). Enquanto bloqueado: **Emitir pedido** e **Emitir e enviar** ficam `disabled`; "Salvar como orçamento" continua ativo.

### 2.3 Busca de produto
Card com label "Buscar produto por código, código de barras, referência ou nome" + campo 44px (borda `#7A8699`, ícone lupa). Focus abre dropdown de resultados (sombra popover): itens com thumbnail 34px, nome, "código · embalagem" (mono), preço, hint "Enter adiciona"; hover `brand-green-bg`. Clique/Enter: adiciona o item com qtde 1 à tabela (produto com grade abre o modal de grade §2.5). Clique fora fecha. Abaixo: chips de atalhos de teclado ↑↓ / Enter / Tab (classe `.pn-kbd`, **ocultos ≤760px**) + **Buscar com fotos** (grade visual) e **Importar de planilha**.

### 2.4 Itens do pedido
Indicador de faixas de desconto (`DiscountTierIndicator`): barras A ≥8.000→3% · B ≥15.000→5% · C ≥30.000→7%, com posição do subtotal atual.

Tabela (card, header "Itens do pedido" + pill "{n} itens", `min-width:560px` scroll-x): cada item normal usa `OrderLineItem` (código, nome, embalagem, preço unit., qtde editável, desconto % editável, total, comissão; **erro de validação inline** — ex.: "O desconto de 18% passa do seu limite de 12% nesta tabela. Reduza para até 12% ou peça liberação ao gestor" — bloqueia emissão até resolver).

**Item de grade** (produto com variações): linha com chevron (expande/colapsa lista "cor · variação — qtde"), pill verde "{n} variações", qtde total, total, lápis reabre o modal de grade para editar.

### 2.5 Modal de grade
Matriz cores × variações (ex.: Preta/Grafite/Azul royal × Com/Sem braços): inputs numéricos 40px centrados, coluna e linha de totais, rodapé com "{n} unidades na grade" + total R$. Tab navega células, Enter confirma (= Adicionar ao pedido). **Adicionar ao pedido**: soma as células >0 como um item de grade (editar substitui o existente); tudo zerado apenas fecha. Cancelar descarta.

### 2.6 Transporte, frete e observações
- Select Transportadora (help "Sai na cópia do pedido para a representada").
- Segmented **CIF · emitente paga** / **FOB · destinatário paga**: CIF mostra selo verde "CIF — o frete é da {representada} acima de R$ {política}"; FOB revela input **Valor do frete** (R$, somado ao total) + checkbox "Somar o frete nas cobranças do cliente" (on).
- Input Observação de entrega; textareas "Observação para o cliente" (sai na cópia) e "para a representada" (só a indústria vê) em 2 colunas.

### 2.7 Coluna lateral (320px)
- **Mix do cliente**: itens já comprados ("{qtde} · última em {data}"); clique adiciona ao pedido (hover `brand-green-bg`).
- **Política comercial** (card-botão): abre drawer com o texto integral da política da representada.
- Aviso azul "Pedido mínimo da {representada}: R$ {valor}. Este já passou." (vira alerta âmbar "Faltam R$ {x}" quando abaixo — bloqueia emissão).

**Modal Alterar contexto**: selects Representada, Tabela de preço (help "Trocar a tabela recalcula os preços dos itens já lançados"), Condição, Forma de pagamento, input Ordem de compra (opcional). Aplicar recalcula e fecha; Cancelar descarta.

### 2.8 Dock inferior (sticky bottom)
`OrderTotalsBar`: nº itens, subtotal, desconto, IPI, ST, frete, **total**, comissão (valor + %). Abaixo: **Salvar rascunho** (secundário → lista), **Emitir pedido** (solid) e **Emitir e enviar** (primário) — ambos desabilitados com cliente bloqueado, itens com erro ou abaixo do mínimo.

### 2.9 Modal de sucesso (pós-emissão)
"Pedido {nº} emitido": ícone verde, resumo "Total de R$ … Comissão prevista de R$ …", grid 2×2: **Enviar por WhatsApp** / **Enviar por e-mail** / **Ver pedido** (→ detalhe) / **Novo pedido** (limpa e recomeça). Fechar → lista de pedidos.

### 2.10 Breakpoints
≤1100px: grid principal vira 1 coluna (lateral desce). ≤1000px: KPIs/kanban internos 2 col. ≤900px: pares de textarea 1 col. ≤760px: atalhos de teclado somem. M/L: dock empilha botões full-width; modais bottom sheet; grade rola na horizontal dentro do modal.

---

## 3. Detalhe do pedido (`pedido-detalhe.dc.html`, PED-03)

### 3.1 Cabeçalho
Breadcrumb "Pedidos › Pedido {nº}". H1 + StatusBadge; subtítulo "cliente · representada · emitido {quando} por {vendedor} · condição · forma". Ações: **Histórico** (drawer com timeline de eventos), **Ver PDF** (nova aba), **Enviar por e-mail** (§3.4), **Enviar por WhatsApp** (§3.4, primário), **⋮ Mais**:
| Item | Ação |
|---|---|
| Alterar pedido | → `pedido-editar.dc.html` (bloqueado se faturado — item desabilitado com tooltip) |
| Copiar link do pedido | Copia URL pública → toast "Link copiado" |
| Alterar estágio | Modal sm: select Novo estágio (Separação/Faturamento/Entrega) + Data (máscara) → confirma, trilha §3.2 atualiza, toast |
| Duplicar pedido | Cria rascunho novo com os mesmos itens → abre na emissão |
| Cancelar pedido (vermelho) | Modal com motivo obrigatório → status Cancelado, toast; comissão zerada |

### 3.2 Trilha de estágios
Card com 4 marcos (Emissão → Separação → Faturamento → Entrega): bolinha com ícone (concluído verde, atual `ink`, futuro cinza), nome + data/hora, conectores coloridos até o estágio atual.

### 3.3 Corpo (grid 1fr + 320px)
- Tabela de itens (min 680px, colunas Item/Qtde/Preço/Desc./Total) + rodapé com Subtotal, IPI, **Total** 18px, Comissão 5% (verde).
- Card **Envios**: registros "WhatsApp para {contato} — {quando} · entregue" / "E-mail para {endereço} — {quando} · aberto às {hora}" (status de leitura em verde).
- Lateral: **Cliente** (CNPJ, endereço, link "Abrir visão 360°"), **Transporte** (transportadora, CIF/FOB, link), **Anotações** (texto + "Adicionar anotação" — input inline, salva na hora).

### 3.4 Modais de envio
- **WhatsApp**: select Destinatário (contatos do cliente + representada), textarea Mensagem pré-preenchida, anexo "pedido-{nº}.pdf" fixo. Enviar → toast "Pedido enviado por WhatsApp", registro em Envios.
- **E-mail**: Para (múltiplos, vírgula), Assunto e Mensagem pré-preenchidos, select Remetente (SMTP próprio; help explica fallback), **Abrir no aplicativo de e-mail** (mailto:) e **Enviar e-mail** → toast + registro.

### 3.5 Breakpoints
T: lateral desce. M/L: ações do cabeçalho viram linha rolável; tabela rola no card; modais bottom sheet.

## 4. Alterar pedido (`pedido-editar.dc.html`)
Mesma tela da emissão (§2) pré-carregada com os itens do pedido; header "Alterar pedido {nº}"; dock com **Cancelar alterações** (volta ao detalhe, confirmação §F 3.3 se houver mudanças) e **Salvar alterações** (recalcula totais, toast, volta ao detalhe; gera evento no Histórico "Pedido alterado por {usuário}").

---

## 5. Aprovações do catálogo (`pedidos-aprovacoes.dc.html`, PED-05)

- Breadcrumb "Pedidos › Aprovações do catálogo". Subtítulo "{n} pedidos do catálogo B2B aguardam sua decisão — o cliente é avisado na hora".
- Card por pedido pendente: ícone loja, cliente + meta ("Loja {representada} · chegou {quando} · condição"), valor 18px + tempo de espera (âmbar), lista de itens (nome × total), ações:
| Botão | Comportamento |
|---|---|
| **Recusar** (secundário) | Modal sm: aviso "O cliente {nome} recebe o motivo por e-mail e pode refazer o pedido", select Motivo (Sem estoque / Preço desatualizado / Abaixo do mínimo / Cadastro pendente / Outro), textarea Mensagem. **Recusar pedido** (danger) → card sai da fila, toast "Pedido recusado. O {cliente} recebeu o motivo por e-mail." Voltar cancela |
| **Aprovar com ajuste** | → emissão (§2) pré-carregada com o pedido para editar antes de emitir |
| **Aprovar pedido** (primário) | Card sai da fila, pedido numerado, toast "Pedido do {cliente} aprovado e numerado. O cliente recebeu a confirmação." |
- Fila vazia: card central verde "Nenhum pedido aguardando aprovação" + explicação.
- Permissão: somente Gestor/Administrador; vendedor não vê o link no subtítulo da lista.
