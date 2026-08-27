# Venda Ágil — Especificação 06 · Catálogo B2B e Loja

Telas internas: `catalogo.dc.html` (hub), `catalogo-configurar.dc.html`, `catalogo-produtos.dc.html`, `catalogo-acessos.dc.html`, `catalogo-pdf.dc.html`, `catalogo-pedido-revisar.dc.html`. Telas públicas (comprador, mobile-first 420px): `loja.dc.html`, `loja-produto.dc.html`, `loja-carrinho.dc.html`, `loja-identificacao.dc.html`, `loja-enviado.dc.html`, `loja-pedidos.dc.html`, `loja-encerrado.dc.html`. Fundamentos: §F.

---

## 1. Hub do catálogo (`catalogo.dc.html`)

- H1 "Catálogo B2B" + subtítulo. Ações: **Configurar catálogo** e **Abrir catálogo** (primário, nova aba → loja).
- **Card Lojas** ("Uma loja por representada… · {n} de 30 na faixa do plano" + **Criar loja**): linha por loja com sigla colorida, nome + badge de status (Ativa verde / Pausada âmbar), link mono, Tabela de preço, Pedido mínimo e 3 ações-ícone:
| Ícone | Ação |
|---|---|
| copy | Copia o link → toast "Link copiado" |
| qr-code | Modal QR: texto de uso, QR 190px, link, **Baixar imagem** e **Imprimir** |
| external-link | Abre a loja em nova aba |
- **Modal Criar loja**: select Representada (só as sem loja; help lista as que já têm), Tabela de preço, Pedido mínimo (R$); prévia do link (`vendaagil.app/c/{slug}` gerado do nome). Criar → linha nova + toast. Limite do plano atingido: botão desabilitado com tooltip → upgrade (07 §4).
- KPIs (4): visitas, compradores ativos, pedidos recebidos, valor no período (delta vs período anterior, verde/vermelho).
- Tabela "Pedidos recebidos pelo catálogo" (30 dias): Recebido (data/hora) · Cliente · Comprador · Itens · Total · Situação (Aguardando aprovação âmbar / Aprovado verde / Recusado vermelho) · ação **Revisar** (→ §3 quando pendente; senão "Ver pedido").

## 2. Configuração e apoio
- **Configurar** (`catalogo-configurar`): identidade (logo upload, cor de destaque), capa, mensagem de boas-vindas, pedido mínimo por loja, exibir/ocultar preços sem login, WhatsApp de contato. Salvar → toast; alterações refletem na loja imediatamente.
- **Produtos do catálogo** (`catalogo-produtos`): lista com switch por produto (exibir/ocultar na loja), destaque (estrela — aparece primeiro), promoção (preço promocional com validade; erro se ≥ preço normal).
- **Acessos** (`catalogo-acessos`): tabela de visitas (comprador, cliente, quando, itens vistos, carrinho aberto?) — clique expande os itens vistos; sem ações destrutivas.
- **PDF** (`catalogo-pdf`): gera catálogo em PDF da seleção (filtros por linha/categoria; capa configurável) → download.

## 3. Revisar pedido do catálogo (`catalogo-pedido-revisar.dc.html`)
Pedido enviado pelo comprador entra como "Aguardando aprovação" (ver 02 §5). Tela: dados do comprador/cliente, itens com qtde/preço **editáveis** (recalcula), condição sugerida, campos de ajuste. Ações: **Recusar** (modal motivo — 02 §5), **Aprovar com ajuste** (salva alterações e emite) e **Aprovar pedido** (emite como está) → numera, notifica o comprador, toast.

---

## 4. Loja pública (comprador)

Layout mobile-first: coluna central máx. 420px, fundo `bg-page`; sem sidebar/topbar do sistema. Identidade da loja (logo, cor) vinda de §2.

### 4.1 Vitrine (`loja.dc.html`)
- Header sticky: logo + "Catálogo para lojistas", ícones **Meus pedidos** (→ §4.6) e **Carrinho** (badge verde com nº de itens).
- Busca "Buscar produto" (nome/código, filtra na digitação) + **Filtros** (drawer: checkboxes de categoria + "Mostrar apenas itens em promoção"; Ver produtos aplica, Limpar reseta).
- Alert info "Pedido mínimo de R$ {x}" com mensagem de progresso.
- Chips de categoria roláveis (Todos default; um ativo).
- Grid 2 colunas de `ProductCard`: foto, nome, código·embalagem, preço (promoção: preço riscado + promocional em verde + selo), stepper de quantidade (+ / qtde / −; adiciona direto ao carrinho). Toque na metade superior do card → página do produto.
- **Barra fixa do carrinho** (rodapé, máx. 420px): "{n} itens" + total 22px; abaixo do mínimo mostra "Faltam R$ {x} para o pedido mínimo" (âmbar) e o CTA fica `disabled`; atingido: **Fechar pedido** → carrinho.
- Rodapé: link WhatsApp "Dúvidas? Fale com a {representada}" + "com tecnologia Venda Ágil".

### 4.2 Produto (`loja-produto.dc.html`)
Galeria de fotos (swipe), nome, código/embalagem, preço (e promo), descrição, variações (grade: seletor por cor/tamanho com qtde por célula), stepper, **Adicionar ao carrinho** (toast + badge atualiza). Voltar → vitrine preservando busca/filtros.

### 4.3 Carrinho (`loja-carrinho.dc.html`)
Lista editável (stepper por item, lixeira remove com desfazer via toast), subtotal, aviso de mínimo (bloqueia continuar), observação do pedido (textarea). **Continuar** → identificação.

### 4.4 Identificação (`loja-identificacao.dc.html`)
CNPJ* (máscara; se já cliente, reconhece e preenche), Razão social*, Nome do comprador*, WhatsApp* (máscara), E-mail. **Enviar pedido** → cria pedido "Aguardando aprovação" no sistema (02 §5), notifica o vendedor, → enviado.

### 4.5 Enviado (`loja-enviado.dc.html`)
Confirmação: check verde, "Pedido enviado para análise", resumo (nº provisório, itens, total), aviso "Você recebe a confirmação no WhatsApp". Ações: **Acompanhar meus pedidos** e **Voltar ao catálogo**.

### 4.6 Meus pedidos (`loja-pedidos.dc.html`)
Lista dos pedidos do comprador (por CNPJ identificado): data, nº, total, status (Em análise / Aprovado / Recusado com motivo). Clique expande os itens.

### 4.7 Encerrado (`loja-encerrado.dc.html`)
Exibida quando a loja está pausada/expirada: mensagem "Este catálogo não está mais disponível" + contato WhatsApp do escritório. Nenhuma navegação de compra.

### 4.8 Breakpoints (loja)
Base já é mobile (420px). ≥768px: coluna central mantém 420–480px centrada (não expande grid); barra do carrinho acompanha a coluna. XS 320px: grid de produtos vira 1 coluna; chips roláveis.

## 5. Regras gerais
- Carrinho persiste por dispositivo (localStorage) até enviar ou 7 dias.
- Preços sempre da tabela vinculada à loja; promoção expira sozinha na data.
- Pedido enviado abaixo do mínimo é impossível pela UI; se a tabela mudar entre carrinho e envio, recalcula e avisa banner âmbar antes de enviar.

## Adendo — 26/08/2026
- Loja mobile: os chips de categoria **quebram linha** (flex-wrap) em vez de rolar na horizontal — corrige o embaralhamento em telas pequenas.
