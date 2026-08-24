# Venda Ágil — Especificação 08 · Acesso e conta

Telas: `entrar.dc.html`, `criar-conta.dc.html`, `verificar-email.dc.html`, `recuperar-senha.dc.html`, `nova-senha.dc.html`, `escolher-conta.dc.html`, `convite.dc.html`, `onboarding.dc.html`, `primeiros-passos.dc.html`, `conta-perfil.dc.html`. Layout dessas telas: card central 400–440px sobre fundo `bg-page`, logo no topo, sem sidebar/topbar. Fundamentos: §F.

---

## 1. Entrar (`entrar.dc.html`)
- Campos: E-mail* (formato) e Senha* (toggle olho mostra/oculta). **Entrar** (primário full-width; loading no submit).
- Erros: credencial inválida → banner vermelho "E-mail ou senha incorretos" (não diz qual), campos preservados; 5 falhas → botão desabilitado 60s com contador.
- Links: "Esqueci a senha" → §3; "Criar conta" → §2.
- Sucesso: 1 conta → Início; várias → Escolher conta (§4). E-mail não verificado → §2.2.

## 2. Criar conta (`criar-conta.dc.html`)
- Campos: Nome*, E-mail* (único — duplicado: erro com link "entrar"), Senha* (mín. 8, indicador de força fraca/média/forte), Nome do escritório*, Telefone (máscara). Checkbox termos* (link abre em nova aba; sem marcar: botão desabilitado).
- **Criar conta** → envia verificação → §2.2.

### 2.2 Verificar e-mail (`verificar-email.dc.html`)
"Enviamos um link para {e-mail}". **Reenviar** (desabilitado 60s com contador após cada envio) e "Trocar e-mail" (volta ao §2 com dados). Link do e-mail → conta ativa → onboarding.

## 3. Recuperar senha
- `recuperar-senha`: E-mail* → **Enviar link** → mensagem neutra "Se o e-mail existir, você recebe o link" (não revela cadastro). Link expira em 1h.
- `nova-senha`: Nova senha* (mesmas regras de força) + Confirmar* (deve coincidir — erro inline). **Salvar** → toast + redireciona para Entrar. Link expirado: mensagem + botão para pedir outro.

## 4. Escolher conta (`escolher-conta.dc.html`)
Lista de escritórios do usuário (logo/sigla, nome, papel). Clique entra na conta. Última usada pré-destacada; lembrada para o próximo login (pulável com "trocar de conta" no menu do avatar).

## 5. Convite (`convite.dc.html`)
Aberto pelo link do e-mail (05 §1): mostra "Você foi convidado para {escritório} como {papel}". Usuário novo: define nome + senha; existente: só **Aceitar convite**. Aceite → entra direto no escritório; convite expirado/revogado: mensagem + contato do gestor.

## 6. Onboarding (`onboarding.dc.html`)
Passos (1 tela cada, barra de progresso, **Pular** sempre visível): 1) dados do escritório; 2) primeira representada; 3) importar clientes (atalho §03-8); 4) convite ao time. Concluir/pular → Início com o Guia inicial (07 §1) refletindo o que ficou pendente.
**Primeiros passos** (`primeiros-passos.dc.html`): versão página do checklist com instruções detalhadas por item e vídeos curtos; itens concluídos marcam sozinhos.

## 7. Perfil (`conta-perfil.dc.html`)
Dentro do sistema (com sidebar): foto (upload, crop circular), nome, e-mail (mudar exige reverificação §2.2), telefone, senha (atual* + nova* + confirmar*), preferências (idioma pt-BR, notificações pessoais). Salvar → toast. **Sair de todos os dispositivos** (confirmação → invalida sessões).

## 8. Regras de sessão
- Sessão 30 dias com renovação por uso; expirada → Entrar com aviso "Sessão expirada" e retorno à URL original após login.
- Breakpoints: card central `min(440px, 100vw-32px)` em todas as faixas; inputs 16px (§F); XS mantém tudo em 1 coluna.
