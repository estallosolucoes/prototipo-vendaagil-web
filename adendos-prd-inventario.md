# Adendos ao PRD e ao inventário de telas — Venda Ágil
Data: 13/08/2026 · Origem: revisão de lacunas do protótipo (§6 do relatório)

Estas seções cobrem o que **nem o PRD nem o inventário previram** e que já foi construído no protótipo. Colar nos documentos originais nos pontos indicados.

---

## 1. PRD §6.x — Módulo Transportadoras (novo)

**Contexto.** A emissão de pedido precisa registrar quem transporta e em que condição (CIF/FOB). O PedidoOK trata transporte como aba do pedido; o Venda Ágil trata como cadastro próprio + bloco na emissão.

**Requisitos:**
- **RF-140** — Cadastro de transportadora: razão social, nome fantasia, CNPJ, IE, RNTRC (ANTT), endereço, contato de coleta, telefone, e-mail, observações. Busca por CNPJ (Receita) e por CEP, como no cliente.
- **RF-141** — Lista de transportadoras com busca por nome/CNPJ, filtro por UF e contagem de pedidos nos últimos 90 dias.
- **RF-142** — Bloco **Transporte e frete** na emissão de pedido: transportadora (ou "Cliente retira"), modalidade CIF/FOB, valor do frete (só FOB), opção "somar o frete nas cobranças do cliente" (só FOB), observação de entrega. Frete FOB soma no total do pedido.
- **RF-143** — A transportadora sai na cópia do pedido (PDF e e-mail) e no detalhe do pedido; a lista de pedidos filtra por transportadora.
- **Fora de escopo (decidido 13/08/2026):** peso e volumes do pedido não são registrados.

**Inventário:** TRA-01 Lista de transportadoras · TRA-02 Cadastro de transportadora. Sidebar: item **Transportadoras** em Cadastros.

---

## 2. PRD §6.3/§6.4 — Cadastros auxiliares (novo requisito)

**RF-145** — Tela única **Cadastros auxiliares** com quatro abas:
- **Categorias de produto** — por representada; reordenação por arrasto (ordem reflete no catálogo); exclusão avisa quantos produtos ficam sem categoria.
- **Segmentos de cliente** — lista simples; usados no cadastro do cliente, filtros e relatórios.
- **Rotas de atendimento** — nome + descrição; atribuição em lote pela lista de clientes.
- **Grades (tamanho/cor)** — ver §3.

Cada aba: criação em modal, edição, exclusão com aviso de vínculos.

**Inventário:** AUX-01 Cadastros auxiliares. Sidebar: item **Cadastros auxiliares** em Cadastros.

---

## 3. PRD — Grades de tamanho e cor (decisão de escopo: ENTRAM, 13/08/2026)

- **RF-146** — Grade por representada: nome, lista de tamanhos (ordenada), lista de cores (opcional — grade só de tamanho é válida).
- **RF-147** — Vínculo no produto (campo "Grade" no cadastro). Produto com grade tem a quantidade digitada **por célula tamanho×cor** na emissão (matriz com total ao vivo); sem grade, quantidade única.
- **RF-148** — Catálogo B2B: produto com grade exibe seleção de variação (alvos ≥44px) antes de adicionar ao pedido; variações podem ter aviso de prazo de produção.

---

## 4. PRD §7 — Permissões do CRM por vendedor (complemento ao RF-103)

- **RF-149** — Na tela do vendedor, grupo **Permissões do CRM**:
  - Visualizar oportunidades: *Somente as próprias* | *Todas*
  - Criar oportunidades: *Permitido* | *Não permitido*
  - Editar oportunidades: *Somente as próprias* | *Todas* | *Não permitido*
  - Excluir oportunidades: *Somente as próprias* | *Todas* | *Não permitido*

---

## 5. PRD — Tempo máximo por etapa do funil (novo)

- **RF-150** — Cada etapa editável de um funil tem **tempo máximo** (valor + unidade: minutos/horas/dias), configurável em Configurações do CRM.
- **RF-151** — A tela de negócios classifica por tempo na etapa: **No prazo · Em atenção · Atrasado** (forma + cor: círculo/triângulo/octógono), disponível como filtro.
- **RF-152** — Cada etapa tem **cor configurável** (paleta fechada de 10 cores); a cor aparece no sublinhado do título da coluna e no contorno inferior dos cards.

---

## 6. Inventário de telas — telas adicionadas nesta fase

| Código | Tela | Arquivo |
|---|---|---|
| TRA-01 | Transportadoras — lista | transportadoras |
| TRA-02 | Transportadora — cadastro | transportadora-cadastro |
| AUX-01 | Cadastros auxiliares (4 abas) | cadastros-auxiliares |
| EQU-02 | Vendedor — detalhe | vendedor-detalhe |
| CAT-04 | Catálogo — acessos do comprador | catalogo-acessos |
| CAT-05 | Catálogo em PDF | catalogo-pdf |
| FIN-05 | Faturamento em lote | faturamento-lote |
| CRM-01 | Negócios (4 funis, kanban + lista) | crm-negocios (reescrita) |
| CRM-04 | Configurações do CRM | crm-configuracoes |
| CRM-05 | Ficha do contato | crm-contato-detalhe |

**Padrões transversais adicionados:** seleção múltipla + barra de ações em lote (pedidos, clientes, produtos, contas a receber); modal SMTP com teste de conexão (Configurações); referências comerciais/bancárias no cadastro do cliente.
