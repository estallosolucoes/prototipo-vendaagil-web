# Venda Ágil — Especificação Funcional (índice/resumo)

> **Especificação detalhada e implementável:** ver a pasta `spec/`:
> - `spec/00-fundamentos.md` — tokens visuais, tipografia, 6 breakpoints, estados de todos os componentes (botões, inputs, modais, drawers, toasts, tabelas), permissões, navegação global e feedbacks padrão.
> - `spec/01-crm.md` — CRM completo no nível "todo botão, todo filtro, todo estado": Negócios, Conversas, Tarefas, NegocioDrawer, chat global, permissões e notificações.
> - `spec/02-pedidos.md` — lista, emissão (busca de produto, grade, frete, bloqueio de cliente), detalhe, edição e aprovações do catálogo.
> - `spec/03-cadastros.md` — clientes (lista/cadastro/360°), produtos, representadas, tabelas de preço, transportadoras, condições, auxiliares e importações.
> - `spec/04-financeiro.md` — faturamento (com corte e cobranças), lote, contas a receber e comissões.
> - `spec/05-equipe.md` — vendedores, convites, equipes, usuários e metas.
> - `spec/06-catalogo-loja.md` — hub do catálogo, lojas, e a loja pública do comprador (vitrine → carrinho → envio).
> - `spec/07-inicio-relatorios-config.md` — início/painel, tour guiado, relatórios, configurações, canais WhatsApp, plano e módulo bloqueado.
> - `spec/08-acesso-conta.md` — login, criação de conta, verificação, senha, convite, onboarding e perfil.

Documento de referência do protótipo. Descreve, por módulo e página, o que cada ação/botão faz e as regras de comportamento esperadas no sistema real.

Última atualização: 18/08/2026 · ~75 telas

---

## 1. Acesso e conta

| Página | Arquivo |
|---|---|
| Entrar | `entrar.dc.html` |
| Criar conta | `criar-conta.dc.html` |
| Verificar e-mail | `verificar-email.dc.html` |
| Recuperar / nova senha | `recuperar-senha.dc.html`, `nova-senha.dc.html` |
| Escolher conta | `escolher-conta.dc.html` |
| Convite | `convite.dc.html` |
| Onboarding / primeiros passos | `onboarding.dc.html`, `primeiros-passos.dc.html` |

**Regras**
- Entrar: valida e-mail/senha; erro exibe mensagem inline sem limpar campos.
- Criar conta → dispara e-mail de verificação → verificação libera onboarding.
- Recuperar senha: envia link por e-mail; Nova senha exige confirmação idêntica.
- Escolher conta: usuários com mais de uma conta (escritório) escolhem em qual entrar.
- Convite: aceite cria usuário já vinculado ao escritório com papel pré-definido.
- Onboarding: passos de configuração inicial (representadas, produtos, equipe); pode pular; Primeiros passos mostra checklist do que falta.

## 2. Navegação global

### Topbar (`Topbar.dc.html`)
- **Busca global**: busca clientes, pedidos, produtos; ≤560px vira ícone que expande.
- **Sino de notificações**:
  - Seção "Tarefas de hoje e atrasadas" no topo: cada item tem checkbox — marcar conclui a tarefa na hora (sincroniza com o módulo Tarefas via store global); desmarcar reabre. Badge "atrasada" em vermelho. Link "Ver todas as tarefas" → `crm-tarefas.dc.html`.
  - Seção "Avisos": aprovações pendentes e eventos do sistema; clicar navega para a página correspondente.
- **Menu do usuário**: perfil, plano, sair.

### Sidebar (`Sidebar.dc.html`)
- Módulos: Início, Pedidos, Cadastros, Financeiro, Equipe, CRM (Negócios, Contatos, Conversas, Tarefas, Configurações do CRM), Relatórios, Configurações.
- Mobile (≤768px): 4 itens + "Menu" que abre bottom sheet com todos os módulos agrupados.
- Item ativo destacado; badge numérico em Conversas (não lidas).

### Chat global (`va-chat.js` — presente em todas as páginas)
- **Balão azul (FAB)** no canto inferior direito. Só aparece se: (a) um cliente mandou mensagem, ou (b) o usuário abriu uma conversa pelo card do negócio. Fechar/finalizar a última conversa esconde o balão.
- Badge vermelho com total de não lidas.
- Clicar abre o **dock de conversas**: janela à direita + trilho de avatares (uma bolha por conversa; clique troca; badge de não lidas por conversa).
- Janela: cabeçalho (avatar, nome, canal WhatsApp), **Finalizar** (encerra e registra no histórico), minimizar, fechar; corpo com bolhas (enviadas à direita, recebidas à esquerda); composer com anexo, áudio, campo de texto (Enter envia), emoji, enviar.
- Estado persiste entre páginas (localStorage): conversas, não lidas, aberto/minimizado.

## 3. Início / Painel
`inicio.dc.html`, `painel.dc.html`
- KPIs do período (vendas, pedidos, ticket médio, metas), gráfico de evolução, atalhos.
- Clicar num KPI abre o relatório correspondente.

## 4. Pedidos
`pedidos.dc.html`, `pedidos-novo.dc.html`, `pedido-detalhe.dc.html`, `pedido-editar.dc.html`, `pedidos-aprovacoes.dc.html`

- **Lista**: filtros por status/representada/período; linha abre o detalhe.
- **Novo pedido** (fluxo em etapas): cliente → representada/tabela → itens (busca de produto, qtde, desconto) → condições (pagamento, transporte) → revisão → emitir.
  - Emitir: valida itens e condição de pagamento; gera número sequencial; pedido entra como "Emitido" (ou "Aguardando aprovação" se exigir alçada).
- **Detalhe**: itens, totais, status, histórico; ações: editar (se não faturado), duplicar, cancelar (pede motivo), gerar PDF, enviar por WhatsApp.
- **Aprovações**: fila para gestor aprovar/reprovar pedidos fora de alçada (desconto acima do limite etc.); reprovar exige justificativa e devolve ao vendedor.

## 5. Catálogo e Loja B2B
`catalogo.dc.html`, `catalogo-produtos.dc.html`, `catalogo-configurar.dc.html`, `catalogo-acessos.dc.html`, `catalogo-pdf.dc.html`, `catalogo-pedido-revisar.dc.html`; loja: `loja*.dc.html`

- **Catálogo**: seleção de produtos, configuração de capa/tema, geração de PDF e link público.
- **Acessos**: quem visualizou o catálogo (cliente, data, itens vistos).
- **Loja B2B**: cliente navega produtos → carrinho → identificação → envia pedido; telas de confirmação (`loja-enviado`) e catálogo encerrado (`loja-encerrado`).
- **Revisar pedido do catálogo**: pedido recebido da loja entra para revisão do vendedor antes de emitir (ajustar itens/preços → emitir como pedido normal).

## 6. Cadastros
- **Clientes** (`clientes`, `cliente-cadastro`, `cliente-360`): CRUD completo; Cliente 360 mostra pedidos, financeiro, conversas, negócios e tarefas do cliente.
- **Produtos** (`produtos`, `produto-cadastro`): CRUD, variações, preços por tabela.
- **Representadas** (`representadas`, `representada-cadastro`, `representada-detalhe`): indústrias representadas; detalhe traz tabelas, comissões e pedidos.
- **Tabelas de preço** (`tabelas-preco`, `tabela-nova`, `tabela-edicao`): criação/edição com vigência; importação de itens.
- **Transportadoras** (`transportadoras`, `transportadora-cadastro`): CRUD.
- **Condições de pagamento** (`condicoes-pagamento`): prazos e parcelamentos aceitos.
- **Cadastros auxiliares** (`cadastros-auxiliares`): segmentos, regiões, etiquetas etc.
- **Importações** (`importacoes`, `importacao-nova`): importar planilhas (clientes, produtos, tabelas); mapeamento de colunas, validação, log de erros.

## 7. Financeiro
- **Faturamento** (`faturamento`, `faturamento-lote`): registrar faturamento de pedidos (parcial/total); em lote seleciona vários pedidos.
- **Comissões** (`comissoes`): apuração por vendedor/representada/período; fechamento gera extrato.

## 8. Equipe
- **Vendedores** (`vendedores`, `vendedor-detalhe`): equipe externa; detalhe com carteira, metas e desempenho.
- **Usuários do escritório** (`usuarios-escritorio`): usuários internos e papéis.
- **Equipes** (`equipes`): agrupamento de vendedores por gestor/região.
- **Metas** (`metas`): metas por vendedor/período; barra de progresso alimentada pelos pedidos.

## 9. CRM

### 9.1 Negócios (`crm-negocios.dc.html`)
- Kanban por funil; card mostra título, cliente, valor, etiquetas, próximo passo.
- **Balãozinho de chat no card**: abre o chat global com aquele cliente (cria a conversa se não existir; se existir, zera não lidas e abre).
- Card → **barra lateral do negócio** (ver 9.5).
- Ganhar/perder: perder exige motivo (cadastrado em Configurações do CRM).

### 9.2 Contatos (`crm-contatos`, `crm-contato-detalhe`)
- Lista/busca de contatos; detalhe com dados, negócios e conversas do contato.

### 9.3 Conversas (`crm-conversas.dc.html`)
- Lista de conversas à esquerda (canal WhatsApp, não lidas); thread à direita.
- Cabeçalho da conversa: **Ver cliente** (→ Cliente 360), **Negócios** (abre a barra lateral do negócio), **botão de nota**, **Emitir pedido**.
- **Nota da conversa**: uma nota por conversa; salva fica **fixada no topo** da thread (sticky); botão desafixar move para o fim da conversa; pode fixar de novo.
- Composer: anexo, **imagem**, **áudio**, texto (/ insere modelo), **emoji** (picker), **agendar mensagem** (Hoje 18:00 / Amanhã 08:00 / escolher data-hora — exige texto escrito) e enviar.
- Modelos de mensagem vêm de `crm-templates`.

### 9.4 Tarefas (`crm-tarefas.dc.html`)
- **Kanban fixo de 4 colunas**: Atrasadas | Hoje | A fazer | Concluídas. A coluna é derivada da data: `data < hoje` e aberta → Atrasadas; `data = hoje` → Hoje; futura → A fazer; `feita` → Concluídas.
- Card: tipo (ícone+cor), horário, título, chip do negócio vinculado (**clique abre a barra lateral do negócio**, não navega), responsável, cliente, Concluir/Reabrir.
- **Filtros**: período (Todas, Hoje, Essa semana, Personalizado com data de/até), **Minhas tarefas** (só as do usuário logado) e status (Todos, Abertas, Atrasadas, Concluídas). Combináveis.
- **Nova tarefa** (modal): título, tipo, data/hora, **Buscar por negócio** (busca com sugestões por nome/cliente; X remove vínculo), responsável, descrição. Criar exige título.
- **Tipos de tarefa** (modal): lista com uso e excluir; cadastrar novo com **nome + ícone + cor**. Excluir tipo não apaga tarefas antigas.
- Store global `va-tarefas.js` (localStorage): mesma fonte para o kanban e as notificações do sino.

### 9.5 Barra lateral do negócio (`NegocioDrawer.dc.html` — componente único usado em Negócios, Conversas e Tarefas)
- Largura ~980px. Cabeçalho: "Negócios — {cliente}", botão **MOVER ENTRE FUNIS** (menu com os funis; trocar move o negócio para a 1ª etapa do funil escolhido), resumo (nº de negócios / em aberto), fechar.
- **Etapas no topo**: setas encadeadas na cor de cada etapa, largura conforme o texto; etapa atual preenchida com selo "etapa atual"; **clicar em outra etapa move o negócio** (toast confirma).
- **NEGÓCIOS DO CLIENTE**: menu suspenso (fechado por padrão, contador ao lado); abre a lista com todos os negócios do cliente — abertos e fechados (status Aberto/Ganho/Perdido, funil › etapa, valor); selecionar troca o negócio exibido.
- Corpo em 2 colunas:
  - Esquerda: resumo do negócio selecionado (valor, tempo na etapa, etiquetas), ações **Criar pedido / Abrir conversa / Criar tarefa** (formulário inline: título + data → cria vinculada ao negócio), **Registrar interação** (Visita/Ligação/WhatsApp/E-mail + anotação → entra no histórico).
  - Direita: **Pedidos vinculados** (link ao detalhe), **Anexos** (anexar arquivos reais, listar, remover), **Histórico** (timeline de eventos).

### 9.6 Templates (`crm-templates`, `crm-template-novo`)
- Modelos de mensagem com variáveis ({{cliente}}, {{vendedor}}); usados no composer via "/".

### 9.7 Configurações do CRM (`crm-configuracoes.dc.html`)
- Abas: Funis (etapas por funil), Motivos de perda, Etiquetas, **Tarefas**, Modelos de mensagem, Automações e WhatsApp.
- **Aba Tarefas**: matriz de permissões por vendedor — **Visualizar | Criar | Editar | Excluir** (switches). Sem Visualizar, o módulo some do menu do vendedor; Excluir vale só para tarefas do próprio vendedor.

## 10. Relatórios
`relatorios.dc.html`, `relatorio.dc.html` — catálogo de relatórios (vendas, comissões, clientes, positivação); cada um com filtros e exportação.

## 11. Configurações gerais
- `configuracoes.dc.html`: hub de configurações do escritório.
- `configuracoes-canais.dc.html`: canais de WhatsApp conectados (número, status, reconectar).
- `conta-perfil.dc.html` / `conta-plano.dc.html`: dados do usuário; plano, cobrança e limites.
- `sistema.dc.html`: parâmetros do sistema.
- `modulo-bloqueado.dc.html`: exibida quando o plano não inclui o módulo (CTA de upgrade).

---

## Regras transversais
- **Toasts** confirmam toda ação (criar, mover, concluir, anexar…); somem em ~2,6s; posição se ajusta quando o chat está aberto.
- **Responsivo**: breakpoint 768px; modais/drawers viram bottom-sheet; inputs 16px (evita zoom iOS); alvos de toque ≥44px; tabelas com scroll interno no card.
- **Permissões**: ações destrutivas e aprovações dependem do papel (gestor × vendedor); tarefas seguem a matriz da aba Tarefas do CRM.
- **Dados de demonstração**: clientes, negócios e mensagens são estáticos; tarefas, tipos e conversas do chat persistem em localStorage.

## Adendo — 27/08/2026 · Tela única de relatórios parametrizada
- relatorio.dc.html é UMA tela para todos os relatórios, parametrizada por URL (?r=<id>) e por um select "Relatório" na barra de filtros (trocar atualiza título, subtítulo, colunas, linhas, gráfico, insight e a URL via history.replaceState). Filtros comuns: período, representada, vendedor. Exportação sai com o relatório+filtros aplicados.
- Atalhos em relatorios.dc.html apontam para relatorio.dc.html?r=<id> — o usuário chega já filtrado.
- Catálogo (ids): venda-geral, abc-clientes, abc-produtos, mais-vendidos, **menos-vendidos** (novo), positivados, inativos, carteira, **com-recebidas**, **com-pendentes**, **com-previstas** (novos — substituem "Comissão na emissão" e "Comissão no faturamento", REMOVIDOS), faturados, cortes, cobrancas (informativo — cobrança é da indústria), crm-funil, **crm-total** (total de negócios), **crm-abertos** (negócios em aberto), **crm-tempo** (tempo médio de atendimento) (novos).
