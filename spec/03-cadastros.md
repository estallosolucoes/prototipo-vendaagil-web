# Venda Ágil — Especificação 03 · Cadastros

Telas: Clientes (`clientes`, `cliente-cadastro`, `cliente-360`), Produtos (`produtos`, `produto-cadastro`), Representadas (`representadas`, `representada-cadastro`, `representada-detalhe`), Tabelas de preço (`tabelas-preco`, `tabela-nova`, `tabela-edicao`), Transportadoras (`transportadoras`, `transportadora-cadastro`), Condições de pagamento (`condicoes-pagamento`), Auxiliares (`cadastros-auxiliares`), Importações (`importacoes`, `importacao-nova`). Fundamentos: §F.

---

## 1. Clientes — lista (`clientes.dc.html`)

### 1.1 Layout
`main` máx. 1440px. H1 "Clientes" + subtítulo "{n} na carteira · {m} positivados neste mês". Ações: **Importar clientes** (→ importação §8 com tipo Clientes) e **Cadastrar cliente** (primário → §2).

### 1.2 Busca e filtros
- SearchField 340px "Buscar por nome, fantasia ou CNPJ" (§F 3.6 — debounce 300ms; CNPJ aceita com/sem máscara).
- Botão **Filtros** com badge verde do nº de filtros ativos; resumo textual ao lado ("Filtrando por **rota Serra Gaúcha** e **situação ativa** · limpar") — link limpar remove todos.
- Drawer Filtros avançados: selects Rota / Segmento / Situação (Ativa default) / Vendedor + checkbox "Somente clientes bloqueados". Aplicar/Limpar como §F. Combinação por E; busca soma por E.

### 1.3 Tabela (grid 28px·1fr·170px·140px·130px·48px, min 760px, scroll-x no card)
Colunas: checkbox master (marca/desmarca a página visível) · Cliente (nome 600 + razão social·rota) · CNPJ (mono) · Cidade · StatusBadge (ativo / inativo_recente / inativo_antigo / prospect / bloqueado) · botão prévia.
| Elemento | Clique |
|---|---|
| Linha | → `cliente-360.dc.html` |
| Checkbox | `stopPropagation`; alimenta a barra em massa (§1.5) |
| Prévia (panel-right-open) | Drawer: grid 2×2 CNPJ/Telefone/Ticket médio/Última compra; Últimos pedidos (3, nº·representada × valor); ações **Abrir visão 360°** e **Criar pedido** (→ emissão com o cliente) |

### 1.4 Painel lateral "Situação da carteira" (320px)
Donut (conic-gradient) com total no centro; legenda Ativos `#78A614` / Inativos recentes `#FFC53D` / Inativos antigos `#E4536A` / Prospects `#7A8699` com contagens. Rodapé-insight: "{n} clientes sem compra há mais de 180 dias somam R$ {x} de venda perdida por ano" + link "Ver relatório de inativos".

### 1.5 Ações em massa (barra fixa §F/02 §1.6)
Alterar rota · Alterar segmento · Vincular vendedor · Vincular tabela · Exportar. Cada uma abre modal com o select correspondente; confirmar aplica a todos os selecionados → toast "{n} clientes atualizados"; Exportar baixa Excel dos selecionados.

### 1.6 Breakpoints
T: painel lateral desce abaixo da tabela. M/L: busca full-width; resumo de filtros quebra linha; tabela rola no card; barra em massa empilha.

---

## 2. Cadastrar/editar cliente (`cliente-cadastro.dc.html`)

Página de formulário única (máx. 1080px), breadcrumb "Clientes › Cadastrar cliente". Seções em cards:

### 2.1 Identificação
- **CNPJ*** (máscara) + botão **Buscar CNPJ** (estado loading §F 3.1; sucesso: selo verde "Dados preenchidos pela Receita" e auto-preenche razão social, fantasia, IE, regime e endereço; falha: toast de erro, campos ficam manuais). CNPJ duplicado na base: erro inline "Cliente já cadastrado — abrir cadastro" (link).
- Razão social* · Nome fantasia · Inscrição estadual · Regime tributário (Simples Nacional / Lucro presumido / Lucro real).

### 2.2 Endereço
- CEP (máscara; ao completar consulta e preenche Endereço/Bairro/Cidade/UF) · Endereço · Número · Bairro · Cidade · UF (2 chars).
- Checkbox "O endereço de entrega é o mesmo da cobrança" (**on** default). Desmarcar revela bloco "Endereço de entrega" (mesmos campos + Referência de entrega) com aviso: "Usado no frete e na ST — a UF de entrega muda o imposto do pedido".

### 2.3 Contatos
Lista de cards (avatar-sigla, "Nome — papel", "telefone · e-mail · aniversário {dd/mm}") + lápis edita. **Adicionar contato**: modal com Nome*, Papel (comprador/financeiro/proprietário/outro), Telefone (máscara), E-mail (formato), Aniversário (dd/mm) → salva, card na lista. Mín. 0 contatos (não obrigatório).

### 2.4 Comercial (coluna A)
Rota (select) · Segmento (select) · Vendedor responsável (select; help "Outros vendedores podem ser vinculados como carteira compartilhada") · **Vendedores com acesso**: chips com X para desvincular + chip tracejado "+ vincular" (abre select de vendedores; duplicado é ignorado).

### 2.5 Condições de pagamento (coluna B)
Checkboxes das condições cadastradas (§7); badge "padrão" na default do escritório. Regra exibida: "Na emissão, só as condições marcadas aparecem para este cliente." Nenhuma marcada = todas disponíveis (regra padrão).

### 2.6 Tabelas de preço
Lista "Representada × Tabela" + **Vincular** (modal: select Representada → select Tabela; uma tabela por representada — vincular de novo substitui).

### 2.7 Crédito e bloqueio
- Limite de crédito (R$; help dinâmico "Em aberto hoje: R$ {x} — {y}% do limite").
- Checkbox "Bloquear sozinho por título vencido" (regra: vencido >30 dias bloqueia emissão; a baixa da cobrança desbloqueia).
- Switch "Bloquear emissão de pedidos agora" (bloqueio manual imediato). Texto: "Bloqueado, o cliente só recebe orçamento. O motivo aparece na emissão." (ver 02-pedidos §2.2).

### 2.8 Referências e observações
Referências comerciais/bancárias em cards 2 col (ícone, nome, sub, lixeira com confirmação) + **Adicionar referência** (modal Nome*, Tipo comercial/bancária, Telefone). Observações (textarea) — aparecem na emissão como aviso do cliente.

### 2.9 Rodapé (sticky)
**Cancelar** (→ lista; confirmação §F 3.3 com alterações) e **Salvar cliente** (valida §F 3.2 — obrigatórios CNPJ e Razão social; sucesso → toast "Cliente cadastrado" e → visão 360°). Edição usa a mesma tela com título "Editar cliente" e botão "Salvar alterações".

### 2.10 Breakpoints
≤900px (`data-va-half`): pares de card viram 1 coluna. M/L: grids internos (CEP/Endereço/Número etc.) empilham em 2 linhas (§F faixa M); rodapé sticky full-width.

---

## 3. Cliente 360° (`cliente-360.dc.html`)
- Cabeçalho: nome + StatusBadge + CNPJ/cidade; ações **Conversar** (chat global), **Criar pedido**, **Editar cadastro**, ⋮ (bloquear/desbloquear com confirmação).
- KPIs: total comprado 12m, ticket médio, frequência, em aberto (financeiro).
- Abas: **Resumo** (últimos pedidos, gráfico de compras por mês, mix mais comprado), **Pedidos** (tabela §F 3.6 filtrada do cliente), **Financeiro** (títulos e status), **Conversas** (threads; clique abre Conversas), **Negócios** (cards; clique abre NegocioDrawer), **Tarefas** (do cliente; concluir inline).
- Regra: aba ativa na URL (`#aba`) para deep-link.

---

## 4. Produtos (`produtos.dc.html`, `produto-cadastro.dc.html`)
- Lista: busca (nome, código, referência, código de barras), filtros Representada / Linha / Situação (ativo·fora de linha), tabela com foto 40px, código mono, nome, embalagem, preço da tabela padrão, situação. Linha → cadastro em modo edição. **Cadastrar produto** e **Importar** no cabeçalho.
- Cadastro: Identificação (código*, nome*, referência, código de barras, representada*, linha, embalagem un/cx·N, peso/dimensões p/ frete), Fotos (upload múltiplo, 1ª = capa, arrastar reordena), **Variações/grade** (atributos ex.: cor × tamanho; gera matriz usada na emissão — ver 02 §2.5), Preços por tabela (linha por tabela vinculada; editar abre a tabela), IPI % e ST (por UF), Situação (ativo / fora de linha — fora de linha some da busca de emissão mas mantém histórico).
- Salvar: valida código único por representada → toast.

## 5. Representadas (`representadas*`)
- Lista: cards com logo, nome, nº de produtos/tabelas, comissão padrão %, status da parceria. Card → detalhe.
- Cadastro: dados (razão*, CNPJ, contatos), comissão padrão %, política comercial (texto exibido na emissão — 02 §2.7), pedido mínimo R$, regra de frete CIF (valor mínimo), prazo de produção.
- Detalhe: abas Dados / Tabelas de preço / Produtos / Pedidos / Comissões. Ações: Editar, Nova tabela.

## 6. Tabelas de preço (`tabelas-preco`, `tabela-nova`, `tabela-edicao`)
- Lista: nome, representada, vigência (de–até), nº itens, status (vigente/futura/vencida — badge). Linha → edição.
- Nova: Nome*, Representada*, Vigência início* (fim opcional; sem fim = até substituição), base (em branco / copiar de outra tabela / importar planilha §8), ajuste % em massa opcional na cópia.
- Edição: tabela de itens (código, nome, preço, IPI, desconto máx. % por item) com edição inline (Enter salva a célula); busca interna; **Reajustar em massa** (modal: % sobre selecionados ou todos, positivo/negativo, prévia antes de aplicar); Exportar; Salvar → toast. Tabela vencida: banner âmbar "Fora de vigência — não aparece na emissão".

## 7. Transportadoras e Condições de pagamento
- **Transportadoras**: lista (nome, CNPJ, cidade, telefone, status) + cadastro (razão*, CNPJ, contato, telefone máscara, e-mail, observação). Usadas no select da emissão (02 §2.6) e no pedido.
- **Condições de pagamento** (`condicoes-pagamento`): lista de condições (nome ex. "30/60/90", nº parcelas, intervalo dias, à vista?) com switch ativa/inativa e estrela "padrão" (uma só); **Nova condição** (modal: nome*, parcelas*, intervalos). Inativar não afeta pedidos existentes; some da emissão.
- **Cadastros auxiliares** (`cadastros-auxiliares`): abas Rotas / Segmentos / Etiquetas / Motivos (listas nome+cor com CRUD simples em modal; excluir item em uso pede confirmação e mostra onde é usado).

## 8. Importações (`importacoes`, `importacao-nova`)
- Lista: histórico (tipo, arquivo, data, usuário, resultado "n importados · m com erro" com link para o log).
- Nova (passos): 1) Tipo (Clientes/Produtos/Tabela de preço) + upload .xlsx/.csv (máx. 10 MB; erro de formato inline); 2) Mapeamento de colunas (selects coluna-do-arquivo → campo-do-sistema; obrigatórios marcados; prévia das 5 primeiras linhas); 3) Validação (contagem ok/erros; tabela de erros linha·campo·motivo; opção "Importar só as válidas"); 4) Confirmação → processa, toast + registro no histórico. Cancelar em qualquer passo descarta (confirmação).

## 9. Breakpoints (módulo)
Todas as listas seguem §F 3.6 (scroll no card, paginação 25). T: colunas laterais descem. M/L: formulários 1 coluna, grids de endereço empilham, modais bottom sheet. XS: tabelas mantêm scroll-x; botões de cabeçalho empilham full-width.

## Adendo — 26/08/2026 (rodada de ajustes com o representante)
### Cliente (cliente-cadastro)
- **Transportadora do cliente** (select no card Comercial) — usada principalmente no FOB, pré-preenchida na emissão.
- **Marcação B2B no cliente**: checkbox "Este cliente usa o catálogo B2B" junto às tabelas vinculadas — o link do catálogo mostra os preços da tabela dele.
- **Desconto por condição de pagamento** (vínculo separado da tabela): cada condição marcada pode ter desconto sobre a tabela (ex.: À vista · PIX −3,00%). Não é faixa por volume; é desconto atrelado ao prazo.
- **Condição especial negociada** (card + modal): por representada; desconto especial %, comissão %, prazo, quem autorizou, validade opcional. Sobrepõe tabela e grade de comissão.
### Representada (representada-cadastro)
- **Modelo de preço**: radio "Tabela única" (varia só o desconto) × "Escada por valor de pedido" (até 10 degraus com valor mínimo próprio; degraus listados + adicionar). No modelo escada o desconto por volume já está no preço.
- **Comissão por faixa de desconto concedido**: grade 0–5%→10 · 5,1–10%→8 · 10,1–20%→5 · acima de 30%→3 (editável, + faixa). Sobrescrevível por tabela de preço e por condição especial do cliente.
### Tabelas de preço
- Estrutura por **curva × varejo/atacado × CIF/FOB é nomenclatura** (coluna Modalidade na lista; curva/público/modalidade no passo Nome da criação). **A escolha da tabela no pedido é manual — o frete nunca troca tabela.**
- Edição da tabela: drawer **"Comissão por faixa"** com checkbox "Sobrescrever a grade da representada".
### Produtos
- Cabeçalho enxuto: só **Cadastrar produto** (primário) + botão **"⋯ Mais ações"** (menu: Configurações de produtos, Exportar, Reajustar preços, Importar fotos, Importar produtos). **Colunas** foi para a barra de filtros, junto do Grade/Tabela.
- **Configurações de produtos** (drawer, abas Categorias e Grades, por representada) — movidas dos cadastros auxiliares.
### Cadastros auxiliares
- Ficam só **Segmentos e Rotas**. Categorias e Grades vivem em Produtos → Configurações de produtos.
### Menu lateral
- **Clientes saiu de Vendas e entrou em Cadastros** (após Representadas). Vendas: Pedidos e Catálogo B2B.
### Importações
- O modelo baixado acompanha o tipo: modelo-clientes / modelo-produtos / **modelo-tabela-de-preco** / modelo-faturamento (.xlsx).

## Adendo — 27/08/2026 · Modelo de preço da representada (regra fechada)
- representada-detalhe ganhou aba "Preço e comissão" com: (1) Modelo de preço — Tabela única (desconto por volume via faixas progressivas da tabela) OU Escada por valor de pedido (até 10 tabelas, cada uma com valor mínimo próprio; desconto por volume embutido no preço); (2) Grade padrão de comissão por desconto — vale para todas as tabelas da representada; a grade da tabela sobrescreve.
- Faixas progressivas × escada são ALTERNATIVAS, nunca somam: modelo única → faixas progressivas; modelo escada → sem faixas (botão desabilitado na tabela-edicao com tooltip). Desconto embutido da escada não entra na faixa de comissão (só o desconto manual).
- tabela-edicao: campo "Valor mínimo do pedido" visível quando a representada usa escada. tabelas-preco: coluna "Mínimo do pedido", escada ordenada do menor mínimo para o maior (Móveis Vale: Tabela 1 R$500 → Tabela 10 R$20.000).
- pedidos-novo (escada): a tabela troca SOZINHA quando o pedido cruza o mínimo da seguinte — toast "Pedido passou de R$ 1.000 — agora na Tabela 2. Preços atualizados." (e o inverso ao cair) + indicador no contexto "Faltam R$ X para a Tabela N (−Y% no preço)". Única troca automática de tabela do sistema; frete nunca troca tabela.
