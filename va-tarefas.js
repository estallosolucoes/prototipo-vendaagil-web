/* Store global de tarefas do CRM Venda Ágil — compartilhado entre páginas via localStorage */
(function () {
  if (window.VATarefas) return;
  var KEY = 'va-tarefas-v1';
  function dISO(off) { var d = new Date(); d.setDate(d.getDate() + off); var m = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0'); return d.getFullYear() + '-' + m + '-' + dd; }
  var TIPOS = [
    { id: 'ligacao', nome: 'Ligação', icone: 'phone', cor: '#176FBC' },
    { id: 'visita', nome: 'Visita', icone: 'map-pin', cor: '#D9822B' },
    { id: 'whatsapp', nome: 'WhatsApp', icone: 'message-circle', cor: '#0E7D57' },
    { id: 'email', nome: 'E-mail', icone: 'mail', cor: '#8B5CB8' },
    { id: 'followup', nome: 'Follow-up', icone: 'clock-3', cor: '#B3202F' }
  ];
  var TAREFAS = [
    { id: 1, titulo: 'Cobrar retorno da proposta', tipo: 'ligacao', negocio: 'Reposição linha operacional', cliente: 'Casa & Lar Móveis', resp: 'CR', data: dISO(-2), hora: '10:00', feita: false },
    { id: 2, titulo: 'Reenviar tabela atualizada', tipo: 'whatsapp', negocio: 'Gaveteiros — promoção', cliente: 'Lojas Pinheiral', resp: 'PS', data: dISO(-1), hora: '15:30', feita: false },
    { id: 3, titulo: 'Ligar para fechar o desconto', tipo: 'ligacao', negocio: 'Pedido trimestral', cliente: 'Depósito São Jorge', resp: 'CR', data: dISO(0), hora: '09:30', feita: false },
    { id: 4, titulo: 'Visita — apresentar linha nova', tipo: 'visita', negocio: 'Reativação após 180 dias', cliente: 'Móveis Baltazar', resp: 'JT', data: dISO(0), hora: '14:00', feita: false },
    { id: 5, titulo: 'Enviar catálogo em PDF', tipo: 'email', negocio: 'Linha de poltronas', cliente: 'Móveis Guarani', resp: 'AP', data: dISO(2), hora: '11:00', feita: false },
    { id: 6, titulo: 'Follow-up da proposta', tipo: 'followup', negocio: 'Mix de lançamento 2027', cliente: 'Depósito São Jorge', resp: 'CR', data: dISO(4), hora: '16:00', feita: false },
    { id: 7, titulo: 'Confirmar recebimento da tabela', tipo: 'whatsapp', negocio: '', cliente: 'Comercial Vitória', resp: 'RC', data: dISO(-1), hora: '17:00', feita: true }
  ];
  var st;
  try { st = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { st = null; }
  if (!st || !Array.isArray(st.tarefas) || !Array.isArray(st.tipos)) st = { tarefas: TAREFAS, tipos: TIPOS, seq: 100 };
  var subs = [];
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} subs.forEach(function (f) { try { f(); } catch (e) {} }); }
  function status(t) { if (t.feita) return 'concluida'; var hoje = dISO(0); if (t.data < hoje) return 'atrasada'; if (t.data === hoje) return 'hoje'; return 'afazer'; }
  window.VATarefas = {
    tarefas: function () { return st.tarefas.slice(); },
    tipos: function () { return st.tipos.slice(); },
    tipoDe: function (t) { for (var i = 0; i < st.tipos.length; i++) if (st.tipos[i].id === t.tipo) return st.tipos[i]; return st.tipos[0]; },
    status: status,
    hoje: function () { return dISO(0); },
    dISO: dISO,
    criar: function (t) { t.id = ++st.seq; t.feita = false; st.tarefas.push(t); save(); return t; },
    concluir: function (id) { st.tarefas.forEach(function (t) { if (t.id === id) t.feita = true; }); save(); },
    reabrir: function (id) { st.tarefas.forEach(function (t) { if (t.id === id) t.feita = false; }); save(); },
    excluir: function (id) { st.tarefas = st.tarefas.filter(function (t) { return t.id !== id; }); save(); },
    addTipo: function (tp) { tp.id = 't' + (++st.seq); st.tipos.push(tp); save(); return tp; },
    delTipo: function (id) { st.tipos = st.tipos.filter(function (t) { return t.id !== id; }); save(); },
    assinar: function (f) { subs.push(f); }
  };
})();
