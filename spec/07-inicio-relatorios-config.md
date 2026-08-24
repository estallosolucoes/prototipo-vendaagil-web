# Venda Ágil — Especificação 07 · Início, Relatórios e Configurações

Telas: `inicio.dc.html`, `painel.dc.html`, `relatorios.dc.html`, `relatorio.dc.html`, `configuracoes.dc.html`, `configuracoes-canais.dc.html`, `sistema.dc.html`, `modulo-bloqueado.dc.html`, `conta-plano.dc.html`. Fundamentos: §F.

---

## 1. Início (`inicio.dc.html`)

- Saudação por hora do dia ("Bom dia/Boa tarde/Boa noite, {nome}") + "{dia da semana}, {data} · {n} pedidos emitidos ontem". **Emitir pedido** (primário) → emissão.
- **Atalhos** (3 cards-link, `data-tour="acoes"`): Emitir pedido / Cadastrar cliente / Cadastrar produto — hover `bg-subtle`.
- **Últimos pedidos** (card, 5 linhas): nº · cliente, meta (representada · quando · vendedor), StatusBadge, valor; linha → detalhe; "Ver todos" → lista.
- **Guia inicial** (card, some quando 5/5): checklist com concluídos riscados (check verde) e pendentes como links; barra de progresso 6px verde; "{x} de 5"; "Abrir o guia completo" → `primeiros-passos`; **Rever o tour guiado** reinicia o tour.
- **Tour guiado**: overlay com "buraco" destacando o elemento (`data-tour`), popover Passo {n} de {total} com título/corpo, **Pular tour** e Avançar/Voltar; Esc encerra; conclusão marca visto (não reaparece sozinho).
- Aviso âmbar "{n} pedidos do catálogo aguardam sua aprovação" (aparece se n>0) → aprovações.
- **Painel** (`painel.dc.html`): versão gerencial — KPIs do mês (vendas, meta, positivação, comissão), gráfico de evolução, ranking de vendedores; cada bloco clica para o módulo correspondente.

## 2. Relatórios (`relatorios.dc.html`, `relatorio.dc.html`)

- Hub em grid 3 colunas de cards por grupo: **Vendas** (Venda geral, Venda por cliente — Curva ABC, Venda por produto — Curva ABC, Produtos mais vendidos), **Clientes** (Positivados, Inativos, Situação da carteira), **Comissões** (na emissão, no faturamento), **Faturamento** (Pedidos faturados, Corte por representada), **Financeiro** (Cobranças), **CRM** (Funil e motivos de perda). Item → tela do relatório.
- Tela do relatório (`relatorio.dc.html`): filtros no topo (período, representada, vendedor — todos os relatórios têm os 3; alguns somam filtros próprios), tabela + gráfico quando aplicável, **Exportar** (Excel/PDF, modal padrão). Curva ABC: classes A/B/C com corte 80/15/5% acumulado. Estados §F 3.6 (vazio/loading/erro).
- Permissão: vendedor vê apenas os próprios dados nos relatórios (filtro vendedor travado).

## 3. Configurações (`configuracoes.dc.html`)

Página única (máx. 980px) em seções; cada alteração salva no blur/toggle com toast "Alterações salvas":
| Seção | Conteúdo e regras |
|---|---|
| **Escritório** | Razão social, CNPJ, Telefone, E-mail — "aparecem no PDF do pedido e nos e-mails" |
| **Regras de venda** | Desconto máximo sem aprovação (%; acima disso o pedido vai para aprovação — ver 02 §2.4) · select "Quem aprova exceções" (Só o dono / Dono e gestores) · switches de regras (ex.: bloquear cliente com título vencido, exigir OC do cliente) |
| **Notificações** | Switches por evento (pedido do catálogo, pedido aprovado/recusado, título vencido, meta atingida) — valem para e-mail e push |
| **Integrações** | WhatsApp Business: estado "Conectado · {número}" + **Desconectar** (confirmação; conversas param de sincronizar) ou **Conectar** (→ §3.1); Usuários do escritório → 05 §4; SMTP de e-mail (config + testar envio) |

### 3.1 Canais de WhatsApp (`configuracoes-canais.dc.html`)
Cards por número conectado: nome/número, status (Conectado verde / Reconectar âmbar com botão que abre QR de pareamento / Desconectado cinza), vendedores vinculados. **Adicionar canal** → QR + instruções. Limite de canais pelo plano (§4).

### 3.2 Sistema (`sistema.dc.html`)
Parâmetros: fuso horário, formato de data/moeda, numeração inicial de pedidos, retenção de rascunhos. Somente Administrador.

## 4. Plano e bloqueio
- **Plano** (`conta-plano.dc.html`): plano atual, faixa de uso (lojas, canais, usuários — barras), valor, próxima fatura, histórico. **Mudar de plano** (comparação de planos → confirmação), atualizar cartão, baixar notas.
- **Módulo bloqueado** (`modulo-bloqueado.dc.html`): exibida ao acessar módulo fora do plano — ícone cadeado, "O módulo {nome} não está no seu plano", benefícios em bullets, **Conhecer os planos** (→ plano) e "Voltar". Sidebar mostra o item com cadeado (clicável para esta tela, não some).

## 5. Breakpoints (módulo)
Início: atalhos 3→1 coluna ≤900px; coluna lateral desce ≤1100px. Relatórios: grid 3→2 (T) →1 (M). Configurações: grids de 2 campos empilham ≤900px; linhas switch mantêm rótulo + switch na mesma linha (switch nunca quebra sozinho).
