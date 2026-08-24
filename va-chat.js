/* Balão de chat global Venda Ágil — aparece quando um cliente manda mensagem ou via VAChat.abrir(cliente, titulo) */
(function () {
  if (window.VAChat) return;
  var KEY = 'va-chat-v1';
  var CORES = ['#176FBC', '#8B5CB8', '#D9822B', '#2AA1A8', '#C2537A'];
  var st;
  try { st = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || !Array.isArray(st.convs)) st = { visivel: false, aberto: false, ativa: null, convs: [], simFeita: false };
  var texto = '';
  var F = "'IBM Plex Sans',system-ui,sans-serif";
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function agora() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function iniciais(n) { return String(n).split(' ').filter(Boolean).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase(); }
  function novaConv(nome, canal, msgs, naoLidas) { return { id: nome, nome: nome, canal: canal, msgs: msgs, naoLidas: naoLidas, cor: CORES[st.convs.length % CORES.length] }; }
  function ativa() { for (var i = 0; i < st.convs.length; i++) if (st.convs[i].id === st.ativa) return st.convs[i]; return st.convs[0] || null; }
  function svg(p, s) { return '<svg width="' + (s || 16) + '" height="' + (s || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  var IC = {
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>',
    minus: '<path d="M5 12h14"></path>',
    x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
    check: '<path d="M20 6 9 17l-5-5"></path>',
    plus: '<path d="M12 5v14"></path><path d="M5 12h14"></path>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line>',
    smile: '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" x2="9.01" y1="9" y2="9"></line><line x1="15" x2="15.01" y1="9" y2="9"></line>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path>'
  };
  var btnIco = 'width:34px;height:34px;flex:none;border:0;border-radius:8px;background:transparent;color:#5B6678;display:grid;place-items:center;cursor:pointer';
  function msgHtml(m) {
    if (!m.de) return '<span style="align-self:center;font:500 11px/1 ' + F + ';color:#5B6678;background:#EDF0F5;border-radius:999px;padding:5px 10px">' + esc(m.data || m.sys) + '</span>';
    var eu = m.de === 'eu';
    return '<div style="display:flex;justify-content:' + (eu ? 'flex-end' : 'flex-start') + '"><span style="max-width:78%;padding:8px 12px;font:400 13.5px/1.5 ' + F + ';color:#021226;background:' + (eu ? '#CDE5FA' : '#FFFFFF') + ';border:1px solid ' + (eu ? '#9CCBF5' : '#E4E8EF') + ';border-radius:' + (eu ? '12px 12px 4px 12px' : '12px 12px 12px 4px') + '">' + esc(m.texto) + '<span style="display:block;text-align:right;margin-top:3px;font:400 10.5px/1 ' + F + ';color:#5B6678">' + esc(m.hora || '') + '</span></span></div>';
  }
  var root = document.createElement('div');
  root.id = 'va-chat-root';
  function render() {
    if (!st.visivel || !st.convs.length) { root.innerHTML = ''; return; }
    var nl = st.convs.reduce(function (a, c) { return a + (c.naoLidas || 0); }, 0);
    if (!st.aberto) {
      root.innerHTML = '<button data-act="abrir" aria-label="Abrir conversas" style="position:fixed;bottom:24px;right:24px;z-index:620;width:56px;height:56px;border-radius:999px;border:0;background:#176FBC;color:#FFFFFF;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 20px rgba(15,90,156,.45)">' + svg(IC.chat, 26) +
        (nl ? '<span style="position:absolute;top:-3px;right:-3px;min-width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;padding:0 6px;border-radius:999px;background:#B3202F;color:#FFFFFF;font:700 11px/1 ' + F + ';border:2px solid #F2F4F7">' + nl + '</span>' : '') + '</button>';
      return;
    }
    var a = ativa(); st.ativa = a.id;
    var rail = st.convs.map(function (c) {
      var on = c.id === a.id;
      return '<button data-act="conv" data-id="' + esc(c.id) + '" title="' + esc(c.nome) + '" aria-label="' + esc(c.nome) + '" style="position:relative;width:44px;height:44px;flex:none;border:0;border-radius:999px;cursor:pointer;display:grid;place-items:center;font:600 13px/1 ' + F + ';color:#FFFFFF;background:' + c.cor + ';box-shadow:' + (on ? '0 0 0 2px #FFFFFF,0 0 0 4px #176FBC' : '0 2px 8px rgba(2,18,38,.2)') + '">' + esc(iniciais(c.nome)) +
        (c.naoLidas ? '<span style="position:absolute;top:-4px;right:-4px;min-width:17px;height:17px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px;border-radius:999px;background:#B3202F;color:#FFFFFF;font:700 10px/1 ' + F + '">' + c.naoLidas + '</span>' : '') + '</button>';
    }).join('');
    var vazia = !a.msgs.some(function (m) { return m.de; });
    root.innerHTML = '<div style="position:fixed;bottom:0;right:16px;z-index:620;display:flex;align-items:flex-end;gap:8px;font-family:' + F + '">' +
      '<div style="display:flex;flex-direction:column;gap:8px;padding-bottom:14px">' + rail + '</div>' +
      '<div style="width:min(380px,calc(100vw - 90px));height:min(560px,calc(100vh - 100px));background:#FFFFFF;border-radius:14px 14px 0 0;box-shadow:0 12px 40px rgba(2,18,38,.28);display:flex;flex-direction:column;overflow:hidden">' +
      '<div style="display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid #E4E8EF">' +
      '<span style="width:36px;height:36px;flex:none;border-radius:999px;display:grid;place-items:center;font:600 12px/1 ' + F + ';color:#FFFFFF;background:' + a.cor + '">' + esc(iniciais(a.nome)) + '</span>' +
      '<span style="display:flex;flex-direction:column;gap:1px;flex:1;min-width:0"><span style="font:600 14px/1.2 ' + F + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(a.nome) + '</span><span style="display:inline-flex;align-items:center;gap:4px;font:400 12px/1.2 ' + F + ';color:#0E7D57;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + svg(IC.chat, 12) + 'WhatsApp · ' + esc(a.canal) + '</span></span>' +
      '<button data-act="finalizar" style="display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 10px;border:0;border-radius:999px;background:#DDF3E4;color:#0E7D57;font:600 12px/1 ' + F + ';cursor:pointer;flex:none">' + svg(IC.check, 13) + 'Finalizar</button>' +
      '<button data-act="min" aria-label="Minimizar" title="Minimizar" style="width:30px;height:30px;flex:none;border:0;border-radius:6px;background:transparent;color:#5B6678;display:grid;place-items:center;cursor:pointer">' + svg(IC.minus) + '</button>' +
      '<button data-act="fechar" aria-label="Fechar conversa" title="Fechar" style="width:30px;height:30px;flex:none;border:0;border-radius:6px;background:transparent;color:#5B6678;display:grid;place-items:center;cursor:pointer">' + svg(IC.x) + '</button>' +
      '</div>' +
      '<div data-msgs style="flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:8px;background:#F7F9FB">' +
      (vazia ? '<span style="align-self:center;text-align:center;font:400 12.5px/1.5 ' + F + ';color:#7A8699;padding:16px 20px">Envie a primeira mensagem para ' + esc(a.nome) + ' pelo WhatsApp.</span>' : '') +
      a.msgs.map(msgHtml).join('') +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:4px;padding:10px 10px;border-top:1px solid #E4E8EF">' +
      '<button aria-label="Anexar arquivo" title="Anexar arquivo" style="' + btnIco + '">' + svg(IC.plus, 18) + '</button>' +
      '<button aria-label="Gravar áudio" title="Gravar áudio" style="' + btnIco + '">' + svg(IC.mic, 17) + '</button>' +
      '<input data-inp placeholder="Mensagem..." aria-label="Mensagem" style="flex:1;min-width:0;height:38px;border:0;border-radius:10px;background:#F2F4F7;padding:0 12px;font:400 16px/1.2 ' + F + ';color:#021226;outline:none">' +
      '<button aria-label="Emoji" title="Emoji" style="' + btnIco + '">' + svg(IC.smile, 17) + '</button>' +
      '<button data-act="enviar" aria-label="Enviar mensagem" title="Enviar" style="width:38px;height:38px;flex:none;border:0;border-radius:999px;background:#176FBC;color:#FFFFFF;display:grid;place-items:center;cursor:pointer">' + svg(IC.send) + '</button>' +
      '</div></div></div>';
    var box = root.querySelector('[data-msgs]'); if (box) box.scrollTop = box.scrollHeight;
    var inp = root.querySelector('[data-inp]'); if (inp) inp.value = texto;
  }
  function enviar() {
    var t = texto.trim(); var a = ativa(); if (!t || !a) return;
    a.msgs.push({ de: 'eu', texto: t, hora: agora() });
    texto = ''; save(); render();
    var inp = root.querySelector('[data-inp]'); if (inp) inp.focus();
  }
  root.addEventListener('click', function (ev) {
    var el = ev.target && ev.target.closest ? ev.target.closest('[data-act]') : null;
    if (!el) return;
    var act = el.getAttribute('data-act');
    if (act === 'abrir') { st.aberto = true; var a = ativa(); if (a) { st.ativa = a.id; a.naoLidas = 0; } }
    else if (act === 'min') { st.aberto = false; }
    else if (act === 'fechar' || act === 'finalizar') {
      var id = st.ativa;
      st.convs = st.convs.filter(function (c) { return c.id !== id; });
      if (!st.convs.length) { st.aberto = false; st.visivel = false; } else { st.ativa = st.convs[0].id; }
    }
    else if (act === 'enviar') { enviar(); return; }
    else if (act === 'conv') { st.ativa = el.getAttribute('data-id'); st.aberto = true; var a2 = ativa(); if (a2) a2.naoLidas = 0; }
    save(); render();
  });
  root.addEventListener('input', function (ev) { if (ev.target && ev.target.hasAttribute && ev.target.hasAttribute('data-inp')) texto = ev.target.value; });
  root.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' && ev.target && ev.target.hasAttribute && ev.target.hasAttribute('data-inp')) enviar(); });
  function mount() { document.body.appendChild(root); render(); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  /* Simulação: um cliente manda mensagem uma única vez, 4 s após o primeiro carregamento */
  setTimeout(function () {
    if (st.simFeita) return;
    st.simFeita = true;
    st.convs.push(novaConv('Depósito São Jorge', 'deposito_sj', [{ data: 'hoje' }, { de: 'cliente', texto: 'Oi! Consegue me passar a previsão de entrega do pedido 4.786?', hora: agora() }], 1));
    st.visivel = true; if (!st.ativa) st.ativa = 'Depósito São Jorge';
    save(); render();
  }, 4000);
  window.VAChat = {
    abrir: function (nome, titulo) {
      var c = null;
      for (var i = 0; i < st.convs.length; i++) if (st.convs[i].id === nome) c = st.convs[i];
      if (!c) st.convs.push(novaConv(nome, String(nome).toLowerCase().replace(/[^a-z0-9]+/g, '_'), [{ data: 'hoje' }].concat(titulo ? [{ sys: 'Negócio: ' + titulo }] : []), 0));
      else c.naoLidas = 0;
      st.ativa = nome; st.visivel = true; st.aberto = true;
      save(); render();
    },
    visivel: function () { return st.visivel; }
  };
})();
