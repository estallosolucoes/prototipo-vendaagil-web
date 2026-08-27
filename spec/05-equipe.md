# Venda Ágil — Especificação 05 · Equipe

Telas: `vendedores.dc.html`, `vendedor-detalhe.dc.html`, `equipes.dc.html`, `usuarios-escritorio.dc.html`, `metas.dc.html`. Papel exigido: Gestor/Administrador (vendedor vê apenas o próprio detalhe e as próprias metas). Fundamentos: §F.

---

## 1. Vendedores (`vendedores.dc.html`)

- H1 + subtítulo "{n} vendedores ativos · {mês}". Ações: **Exportar** (modal padrão formato+colunas) e **Convidar vendedor** (primário).
- Tabela (min 1020px, 7 col): Vendedor (avatar 36px + nome + e-mail) · Equipe · Carteira (nº clientes) · Vendido no mês · Meta · **Progresso** (barra 6px: ≥80% verde `#78A614`, 50–79% âmbar `#FFC53D`, <50% vermelho `#E4536A` + % ao lado) · Situação (Ativo verde / Convite enviado âmbar / Inativo cinza). Linha → `vendedor-detalhe.dc.html`. Ordenação default: vendido desc.
- **Modal Convidar vendedor**: texto "O vendedor recebe um e-mail com o convite e entra com a carteira que você definir"; E-mail* (formato), selects Equipe e Papel (Vendedor/Gestor). **Enviar convite** → linha "Convite enviado" na tabela, toast; e-mail leva ao fluxo `convite.dc.html` (08 §5). Reenviar convite: ⋮ na linha pendente.

## 2. Detalhe do vendedor (`vendedor-detalhe.dc.html`)
- Cabeçalho: avatar, nome, e-mail/telefone, equipe; ações **Editar** (modal com dados + equipe + papel), ⋮ (Desativar — confirmação "O vendedor perde o acesso; a carteira fica sem responsável até ser redistribuída" / Reativar).
- KPIs do mês: vendido, meta e %, positivação (clientes atendidos/carteira), ticket médio.
- Blocos: **Carteira** (tabela de clientes; ação em massa "Transferir para outro vendedor" — select + confirmação → toast), **Pedidos recentes**, **Metas** (histórico mensal meta × realizado), **Comissões** (somente Gestor).

## 3. Equipes (`equipes.dc.html`)
- Cards por equipe: nome, gestor, nº vendedores, vendido no mês, meta agregada + barra.
- **Nova equipe** (modal: Nome*, Gestor select, cor). Card → editar (mesmo modal) + lista de membros com "+ adicionar" (select de vendedores sem equipe) e X remover (confirmação; vendedor fica "Sem equipe").
- Excluir equipe: só sem membros (senão botão desabilitado com tooltip).

## 4. Usuários do escritório (`usuarios-escritorio.dc.html`)
- Tabela: Usuário (nome+e-mail), Papel (Administrador/Gestor/Financeiro), Último acesso, Situação. **Convidar usuário** (e-mail* + papel). ⋮: Alterar papel (select; não pode remover o último Administrador — erro), Desativar (confirmação; não a si mesmo — desabilitado).

## 5. Metas (`metas.dc.html`)

### 5.1 Cabeçalho
H1 "Metas" + subtítulo "{mês} · {n} dias úteis restantes". Select de mês (navega competências, inclusive futura para planejar) + **Encerrar mês** + **Definir metas** (primário).

### 5.2 Painéis
- `GoalCard` (340px): realizado atual × alvo, dias úteis restantes, projeção (ritmo atual × dias úteis). Projeção ≥ meta: verde; < meta: âmbar.
- Gráfico "Meta × realizado por mês" (BarChart 6 meses, atual destacado).

### 5.3 Tabela por vendedor (min 960px)
Vendedor · Meta · Realizado · Projeção · Progresso (barra + %, cores §1) · Tendência (badge: "vai bater" verde ↗ / "no limite" âmbar → / "vai faltar" vermelho ↘, calculada pela projeção). Sem clique de linha (dados); nomes → detalhe do vendedor.

### 5.4 Modal Definir metas (md)
- Texto-regra: "A meta de cada vendedor soma a meta do escritório. Vendedor sem meta não aparece no ranking."
- Segmented **Por vendedor** (default) / **Por representada**: grids "nome × input R$". Nota no modo representada: "mede a positivação de cada indústria, independente de quem vendeu". Os dois modos coexistem (salvos separadamente).
- Salvar → recalcula painéis, toast "Metas de {mês} salvas". Cancelar descarta.

### 5.5 Encerrar mês
Modal de confirmação: congela o resultado (não recebe mais pedidos retroativos), gera o ranking final e notifica vendedores. Irreversível — botão danger com texto explícito; após encerrar, o mês fica somente-leitura (banner no topo ao visitá-lo).

## 6. Breakpoints (módulo)
T: painéis de Metas empilham (GoalCard acima do gráfico). M/L: tabelas rolam no card; modais bottom sheet; grids "nome × input" mantêm 2 colunas (input 140px). XS: KPIs 1 coluna.

## Adendo — 26/08/2026 · Metas refatoradas (metas.dc.html)
- **Meta por vendedor × representada**: cada vendedor tem meta por representada; a meta global do vendedor é a SOMA delas. Painel com linha expansível por vendedor (chevron) mostrando meta/realizado/progresso por representada; linha principal traz meta global, realizado, projeção e tendência calculados.
- **Filtro por representada** no painel (select de contexto): filtrando, meta global/progresso/tendência recalculam só daquela representada; vendedor sem meta na representada sai da lista.
- **Modal Definir metas** (size lg): select "Mês das metas" no topo (rodapé e botão Salvar refletem o mês). Lançamento por seleção — nada de lista fixa de todos:
  - Por vendedor: dropdown multi-seleção de vendedores (checkboxes, marcar todos/limpar, contador) + representada + valor → Adicionar lança a mesma meta para todos os marcados; repetir vendedor×representada substitui. Lançamentos agrupados por vendedor com meta global (soma) e remoção por linha.
  - Por representada: representada + valor → Adicionar; mede positivação da indústria.
  - Campo de valor: não-controlado + máscara monetária global; Enter adiciona. Resumo no rodapé: "N metas lançadas · mês · total R$ X" (singular/plural correto).
