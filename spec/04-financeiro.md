# Venda Ágil — Especificação 04 · Financeiro

Telas: `faturamento.dc.html`, `faturamento-lote.dc.html`, `comissoes.dc.html`. Papel exigido: Financeiro, Gestor ou Administrador (vendedor não vê o grupo). Fundamentos: §F.

---

## 1. Faturamento (`faturamento.dc.html`)

### 1.1 Layout
`main` máx. 1280px. H1 "Faturamento" + subtítulo "O que as representadas efetivamente faturaram dos seus pedidos · {mês}". Ações: **Exportar** (modal formato/colunas, padrão §4.4), **Lançar um pedido** (abre modal §1.4) e **Lançar em lote** (primário → §2).

### 1.2 KPIs (grid 3; ≤1000px vira 2; M/L 1)
- **Faturado no mês** (R$ 28px + "{n} notas de {m} representadas").
- **Emitido aguardando faturar** (+ "{n} pedidos na fila das indústrias · lançar em lote" — link → §2).
- **Corte médio do mês** (% + comparativo com o mês anterior: verde ↘ quando melhor, vermelho ↗ quando pior).

### 1.3 Busca, filtros e tabela
Busca "Buscar por nota, pedido ou cliente" + selects Representada e Mês (competência). Tabela (min 1060px, 8 colunas): Nota fiscal (mono) · Pedido (link mono → detalhe do pedido) · Cliente · Representada · valor do Pedido · **Faturado** (600) · **Corte** (%; 0% cinza, >0 âmbar, ≥15% vermelho) · Data. Ordenação default: data desc. Paginação §F 3.6.

### 1.4 Modal "Lançar faturamento — pedido {nº}" (size lg)
| Campo/бloco | Regra |
|---|---|
| Pedido (select) | Somente pedidos emitidos ainda não 100% faturados; trocar recarrega os itens |
| Nota fiscal* (mono) + Data* (máscara) | Obrigatórios |
| **Itens faturados** (tabela Item · Pedido · Faturado · Valor) | Coluna Faturado editável (número ≥0, default = qtde do pedido); valor recalcula na hora. Texto-guia: "Faturou menos que o pedido? Ajuste a quantidade — o resto vira corte." Qtde > pedido: erro inline |
| **Banner de corte** (aparece quando ∑faturado < ∑pedido) | Âmbar: "Corte de {pct} — {R$}" + select obrigatório **Motivo do corte** (Sem estoque na indústria / Crédito recusado / Item fora de linha / Erro no pedido / Outro). "O motivo sai no relatório de cortes por representada." |
| Checkbox **Gerar cobranças pela condição do pedido — {condição} · {forma}** (on) | Marcado, mostra prévia das parcelas (cards vencimento × valor, calculados sobre o faturado). Confirmar cria os títulos em Contas a receber |
| Confirmar | Valida NF+data (+motivo se corte) → registra: pedido vira `faturado_parcial` ou `faturado_total`, linha na tabela, títulos criados, comissão recalculada sobre o faturado → toast "Faturamento lançado". Cancelar descarta |

### 1.5 Breakpoints
T: KPIs 2+1. M/L: filtros empilham; tabela rola; modal bottom sheet com itens roláveis.

---

## 2. Faturamento em lote (`faturamento-lote.dc.html`)
- Lista dos pedidos "aguardando faturar" com checkbox; para cada selecionado, campos NF e Data inline na linha (mesmas validações de §1.4; sem ajuste de itens — lote assume faturamento integral; para parcial, usar §1.4).
- Rodapé fixo: "{n} pedidos · R$ {total}" + **Lançar {n} faturamentos** → processa todos, toast com o resultado, volta ao §1. Linha com erro (NF vazia) destaca em vermelho e impede o lote.

---

## 3. Contas a receber (`contas-receber.dc.html`)
- KPIs: A vencer / Vencidos (vermelho) / Recebidos no mês.
- Filtros: busca (cliente, nº título, pedido), status (Todos / A vencer / Vencido / Pago), mês, representada.
- Tabela: Título (mono) · Pedido (link) · Cliente · Parcela ("2/3") · Vencimento (vencido em vermelho 600) · Valor · StatusBadge (a_vencer / vencido / pago) · ação **Baixar** (título aberto).
- **Baixar título**: modal sm "Registrar o recebimento de {R$} do {cliente}?" + Data do recebimento (default hoje) + Forma → confirma: status Pago, toast "Título baixado". Regra: a baixa do último título vencido de um cliente remove o bloqueio automático (03 §2.7).
- **Desfazer baixa** (⋮ na linha paga): confirmação → volta a A vencer/Vencido.
- Título vencido >30 dias dispara o bloqueio automático do cliente (se ativado no cadastro).

---

## 4. Comissões (`comissoes.dc.html`)

### 4.1 Cabeçalho
H1 "Comissões" + subtítulo "Fechamento por representada · {mês}". Select de mês (troca a competência inteira) + **Exportar**.

### 4.2 Cartão-resumo (dark `ink`, 340px) + gráfico
- "A RECEBER NO MÊS" (lime) com valor grande; linhas: Confirmada pelas indústrias / Prevista aguardando faturar / **Recebida no mês** (verde `#4FC599`).
- Card "Comissão por mês": BarChart dos últimos 6 meses (recebida), mês atual destacado.

### 4.3 Tabela de fechamentos (min 1000px, 7 colunas)
Representada (sigla em quadrado dark + nome) · % média · Faturado · **Comissão** (600) · Situação (badge com ícone: Prevista cinza / Confirmada azul / Recebida verde) · Previsão (data) · ação:
| Situação | Botão da linha |
|---|---|
| Confirmada | **Baixar** → modal sm "Registrar o recebimento de {R$} da {representada}?" + Data do recebimento → confirma: situação Recebida, entra em "Recebida no mês", toast. Texto-regra: "Baixar a comissão registra o recebimento e concilia com os faturamentos do período." |
| Prevista | Botão desabilitado (tooltip "Aguardando faturamento da indústria") |
| Recebida | Sem ação (check verde) |

### 4.4 Modal Exportar comissões
Select Formato (Excel default / PDF) + grade de checkboxes de colunas (Representada, %, Faturado, Comissão, Situação, Previsão…). **Exportar {n} fechamentos** → download + fecha.

### 4.5 Regras de cálculo
Comissão = % da representada (ou % por item, quando definida na tabela de preço) sobre o **valor faturado** (não o emitido). Corte reduz proporcionalmente. Pedido cancelado zera. Vendedor vê apenas as próprias comissões (mesma tela filtrada, sem ação Baixar).

### 4.6 Breakpoints
T: cartão-resumo em cima do gráfico (1 coluna). M/L: tabela rola no card; modais bottom sheet. XS: valor grande 28px.

## Adendo — 26/08/2026
- Botões do cabeçalho renomeados: **"Faturar um pedido"** e **"Faturar em lote"** (antes "Lançar…"). Link do KPI acompanha.
- **Faturamento parcial**: quando o faturado é menor que o pedido, o modal pergunta o destino da diferença — radio **"Registrar como corte"** (com motivo; sai no relatório de cortes) ou **"Faturamento parcial — manter o saldo em aberto"** (pedido permanece em "Emitido aguardando faturar" com o saldo para a próxima nota).

## Adendo — 26/08/2026 · Contas a receber REMOVIDO
- Módulo excluído do sistema (tela, menu, notificações e links): o representante não controla os títulos/pagamentos dos clientes — esse controle é da indústria. A seção 3 acima fica sem efeito.
- Consequências aplicadas: modal de faturamento não gera mais cobranças (nota explica que a cobrança é da indústria); bloqueio de cliente passa a ser manual, acionado quando a indústria informa inadimplência (cadastro do cliente e banner da emissão atualizados).

## Adendo — 27/08/2026 · Módulo de Despesas (despesas.dc.html)
- Novo item Financeiro › Despesas no menu. Lançamento manual: descrição, categoria (Viagem/Combustível/Imposto/Contador/Mostruário/Outros), data, valor (máscara monetária global), representada opcional, rota opcional, checkbox "Despesa fixa mensal" (repete todo mês).
- Tela: KPIs (total do mês, fixas mensais, custo da rua, % sobre comissões recebidas), filtros mês/categoria/representada, tabela com chip de categoria (ícone+cor), recorrência, apagar por linha, total do filtro no rodapé, botão "Ver relatório".
- Relatório "Despesas da representação" (relatorio.dc.html?r=despesas): agregado por categoria + gráfico + insight (fixas × custo da rua). Atalho no hub de relatórios.
- Fluxo de caixa previsto (?r=fluxo-caixa) também no hub — ver spec/07.

## Adendo — 27/08/2026 · Apagar despesa recorrente (escopo)
- Apagar uma despesa "Fixa mensal" abre modal de escopo: "Somente este lançamento" (recorrência continua) · "Este e os que estão por vir" (encerra dali em diante) · "Todos os lançamentos" (remove a fixa inteira). Despesa avulsa apaga direto. Mesmo padrão do apagar de tarefas recorrentes.
