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

- Hub em grid 3 colunas de cards por grupo: **Vendas** (Venda geral, Venda por cliente — Curva ABC, Venda por produto — Curva ABC, Produtos mais vendidos), **Clientes** (Positivados, Inativos, Situação da carteira), **Comissões** (na emissão, no faturamento), **Faturamento** (Pedidos faturados, Corte por representada), **Financeiro** (Cobranças), **CRM** (Motivos de perda). Item → tela do relatório.
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

## Adendo — 27/08/2026 · Tela única de relatórios parametrizada
- relatorio.dc.html é UMA tela para todos os relatórios, parametrizada por URL (?r=<id>) e por select "Relatório" na barra de filtros (trocar atualiza título, colunas, linhas, gráfico, insight e a URL). Filtros comuns: período, representada, vendedor. Exportação sai com o relatório+filtros aplicados.
- Atalhos em relatorios.dc.html → relatorio.dc.html?r=<id> (usuário chega já filtrado).
- Catálogo: venda-geral, abc-clientes, abc-produtos, mais-vendidos, menos-vendidos (novo), positivados, inativos, carteira, com-recebidas/com-pendentes/com-previstas (novos — "Comissão na emissão" e "Comissão no faturamento" REMOVIDOS), faturados, cortes, cobrancas (informativo), crm-funil, crm-total, crm-abertos, crm-tempo (novos).

## Adendo — 27/08/2026 · Fluxo de caixa previsto (Financeiro)
- Novo relatório fluxo-caixa: próximos 90 dias, comissões por mês de entrada esperada — colunas Pendentes (já faturadas) + Previstas (a faturar) + Total + chip de confiança (alta/média/baixa). Deriva dos dados existentes (comissões pendentes/previstas); nenhum campo novo.
- Relatório de despesas da representação: PENDENTE de decisão — exige módulo novo de lançamento de despesas (não existe registro de viagem/combustível/imposto/contador no sistema hoje).

## Adendo — 27/08/2026 · Drill-down dos KPIs do painel
- Cards de métrica com lista por trás (clientes ativos/novos/sem compra 60d, conversas abertas, visitas agendadas, contatos novos, a receber na semana, pedidos no mês) são clicáveis: cursor pointer, hover elevado e chevron discreto no canto inferior direito sinalizam o drill-down.
- Clique abre drawer à direita (440px) com a lista nominal: avatar-sigla, nome, meta (data/origem/última mensagem), chip contextual (ex. "já com pedido", "desde ontem", "B2B") e valor; cada linha linka para o registro; rodapé "Ver tudo em [módulo]" leva à tela completa filtrada.
- KPIs puramente aritméticos (ticket médio, mix médio, dias úteis restantes) NÃO abrem drawer — não há lista por trás. O X de remover do painel continua funcionando à parte (stopPropagation).

## Adendo — 27/08/2026 · Reordenação dos cards do painel (drag & drop)
- TODOS os cards do painel são arrastáveis — KPIs, gráficos (Faturamento por mês, Evolução), Últimos pedidos, Meta, Positivação, Aprovações e Curvas ABC — cada um com alça grip-vertical no título: HTML5 drag + reordenação por CSS order no flex container; soltar sobre outro card insere na posição dele.
- Dentro da fileira, cards trocam de posição entre si; arrastar um card SOBRE OUTRA FILEIRA move a fileira inteira dele para aquela posição (ex.: gráfico arrastado sobre os KPIs leva a fileira de gráficos ao topo) — o card sempre mantém o tamanho que ocupa. Ordem das fileiras em localStorage va_painel_filas. Ordem persistida em localStorage (va_painel_ordem); cursor grab; drill-down e remover (X) continuam funcionando.
