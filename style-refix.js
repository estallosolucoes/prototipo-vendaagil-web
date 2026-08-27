/* Corrige recálculo de estilo dos nós montados pelo runtime antes do parse das folhas:
   re-insere os elementos com classes do DS uma vez após o load (comprovado no webview). */
(function () {
  function refix() {
    document.querySelectorAll('[class*="va-"]').forEach(function (el) {
      var p = el.parentNode; if (!p) return;
      var n = el.nextSibling;
      p.removeChild(el); p.insertBefore(el, n);
    });
  }
  if (document.readyState === 'complete') { refix(); setTimeout(refix, 300); }
  else window.addEventListener('load', function () { refix(); setTimeout(refix, 300); setTimeout(refix, 1000); });
})();

/* ===== Campo monetário global (padrão do sistema) =====
   Qualquer input com prefixo "R$" (DS Input prefix, ou span irmão "R$", ou [data-money])
   ganha máscara de centavos em tempo real: só dígitos entram, "100000" → "1.000,00".
   Vale para digitação e colagem. O valor numérico fica em el.dataset.valorNumerico. */
(function () {
  function isMoney(el) {
    if (el.dataset && el.dataset.money != null) return true;
    var wrap = el.closest && (el.closest('.va-inputwrap') || el.parentElement);
    if (!wrap) return false;
    for (var i = 0; i < wrap.children.length; i++) {
      var c = wrap.children[i];
      if (c !== el && (c.textContent || '').trim() === 'R$') return true;
    }
    return false;
  }
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (!(el instanceof HTMLInputElement)) return;
    if (el.type === 'checkbox' || el.type === 'radio' || el.type === 'number') return;
    if (!isMoney(el)) return;
    var digits = el.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 12);
    var cents = parseInt(digits || '0', 10);
    el.value = digits ? (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
    el.dataset.valorNumerico = String(cents / 100);
    try { el.setSelectionRange(el.value.length, el.value.length); } catch (err) {}
  }, true);
  // bloqueia letras/símbolos antes de entrarem (melhor feedback que corrigir depois)
  document.addEventListener('keydown', function (e) {
    var el = e.target;
    if (!(el instanceof HTMLInputElement) || el.type === 'number') return;
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) return;
    if (!isMoney(el)) return;
    if (!/\d/.test(e.key)) e.preventDefault();
  }, true);
})();

/* Centraliza verticalmente os ícones dos botões em todo o sistema:
   .va-icon é um span inline-flex 20×20 sem align-items, e a regra global
   svg[data-lucide]{width:1em;height:1em} encolhe o svg, que ficava colado
   no topo do span (ícone ~3px acima do centro do texto). */
(function () {
  var s = document.createElement('style');
  s.textContent =
    '.va-icon{align-items:center;justify-content:center}' +
    '.va-btn__icon{display:inline-flex;align-items:center;align-self:center}' +
    'i[data-lucide]{align-items:center;justify-content:center}' +
    'button i[data-lucide], a i[data-lucide]{align-self:center}';
  (document.head || document.documentElement).appendChild(s);
})();

/* Substitui BarChart e LineChart do bundle: os originais usam viewBox de 100
   unidades com preserveAspectRatio "none", esticando texto, marcador e barras.
   Estas versões medem o contêiner em px (sem distorção), alinham os rótulos aos
   pontos reais e mantêm classes (va-chart*) e assinatura de props.
   A instalação depende só do namespace (React é lido na hora do render),
   eliminando a corrida em que o componente original chegava a montar. */
(function () {
  /* Os componentes corrigidos ficam num registro fixo; o namespace ganha traps de
     propriedade (getter devolve sempre a versão corrigida, setter descarta a original),
     então QUALQUER ordem de carga — bundle antes ou depois deste arquivo, inclusive o
     bundle atribuindo ns.BarChart depois — resolve para a versão em pixels já no 1º mount. */
  var FIXED = {};
  function trap(ns) {
    if (!ns || ns.__chartsFixed) return ns;
    ['BarChart', 'LineChart'].forEach(function (name) {
      try {
        Object.defineProperty(ns, name, {
          configurable: true,
          get: function () { return FIXED[name]; },
          set: function () { /* descarta o original do bundle */ }
        });
      } catch (e) { ns[name] = FIXED[name]; }
    });
    ns.__chartsFixed = true;
    return ns;
  }
  var current = window.VendaGilDesignSystem_bb4846;
  try {
    Object.defineProperty(window, 'VendaGilDesignSystem_bb4846', {
      configurable: true,
      get: function () { return current; },
      set: function (v) { current = trap(v); }
    });
  } catch (e) {
    (function retry() { var ns = window.VendaGilDesignSystem_bb4846; if (ns) trap(ns); else setTimeout(retry, 60); })();
  }
  if (current) trap(current);

  (function define() {

    function useWidth(ref, fallback) {
      var React = window.React;
      var st = React.useState(fallback); var w = st[0], setW = st[1];
      React.useLayoutEffect(function () {
        var el = ref.current; if (!el) return;
        var measure = function () { if (el.clientWidth) setW(el.clientWidth); };
        measure();
        var ro = new ResizeObserver(measure); ro.observe(el);
        return function () { ro.disconnect(); };
      }, []);
      return w;
    }

    FIXED.BarChart = function BarChart(props) {
      var React = window.React;
      var data = props.data || [];
      var height = props.height || 260;
      var highlight = props.highlight;
      var valueFormat = props.valueFormat || function (v) { return v.toLocaleString('pt-BR'); };
      var showGrid = props.showGrid !== false;
      var ref = React.useRef(null);
      var w = useWidth(ref, 600);
      var padTop = 28, padBottom = 26, padLeft = 34;
      var plotH = height - padTop - padBottom;
      var max = Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
      var band = (w - padLeft) / Math.max(data.length, 1);
      var barW = Math.min(band * 0.52, 56);
      var ticks = 5;
      var kids = [];
      if (showGrid) {
        var lines = [];
        for (var i = 0; i < ticks; i++) {
          var y = padTop + plotH / (ticks - 1) * i;
          lines.push(React.createElement('line', { key: i, x1: padLeft, x2: w, y1: y, y2: y, strokeDasharray: '2 3' }));
        }
        kids.push(React.createElement('g', { key: 'grid', className: 'va-chart__grid' }, lines));
      }
      data.forEach(function (d, i) {
        var h = d.value / max * plotH;
        var x = padLeft + band * i + (band - barW) / 2;
        var isHi = highlight === i || d.highlight;
        var g = [React.createElement('rect', {
          key: 'r', className: 'va-chart__bar' + (isHi ? ' va-chart__bar--highlight' : ''),
          x: x, y: padTop + plotH - h, width: barW, height: h, rx: 2
        })];
        if (isHi) {
          var txt = valueFormat(d.value);
          var est = txt.length * 7.2;
          var tx = Math.max(padLeft + est / 2, Math.min(x + barW / 2, w - est / 2 - 2));
          g.push(React.createElement('text', {
            key: 't', className: 'va-chart__label',
            x: tx, y: padTop + plotH - h - 8, textAnchor: 'middle', style: { fontSize: 12 }
          }, txt));
        }
        kids.push(React.createElement('g', { key: d.label }, g));
      });
      var labels = [React.createElement('span', { key: '_pad' })].concat(data.map(function (d) {
        return React.createElement('span', {
          key: d.label,
          style: { textAlign: 'center', font: '400 var(--type-caption-size)/1 var(--font-ui)', color: 'var(--data-axis)', textTransform: 'uppercase', letterSpacing: '.04em' }
        }, d.label);
      }));
      return React.createElement('div', { className: 'va-chart', role: 'img', 'aria-label': props.ariaLabel || 'Gráfico de barras', ref: ref },
        React.createElement('svg', { viewBox: '0 0 ' + w + ' ' + height, preserveAspectRatio: 'xMinYMin meet', style: { height: height, width: '100%' } }, kids),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: padLeft + 'px repeat(' + data.length + ', 1fr)', marginTop: -20 } }, labels)
      );
    };

    FIXED.LineChart = function LineChart(props) {
      var React = window.React;
      var realized = props.realized || [];
      var forecast = props.forecast || [];
      var target = props.target;
      var height = props.height || 220;
      var labels = props.labels || [];
      var area = props.area !== false;
      var ref = React.useRef(null);
      var w = useWidth(ref, 600);
      var padTop = 14, padBottom = 6, padL = 8, padR = 8;
      var plotH = height - padTop - padBottom;
      var all = realized.concat(forecast).concat(target != null ? [target] : []);
      if (!all.length) all = [1];
      var hi = Math.max.apply(null, all), lo = Math.min.apply(null, all);
      var head = (hi - lo || hi || 1) * 0.18;
      var max = hi + head, min = Math.max(0, lo - head * 1.6);
      var span = max - min || 1;
      var last = realized.length - 1;
      var n = Math.max(realized.length + Math.max(forecast.length - 1, 0), labels.length, 2);
      var x = function (i) { return padL + (w - padL - padR) / (n - 1) * i; };
      var y = function (v) { return padTop + plotH - (v - min) / span * plotH; };
      var path = function (arr, off) {
        off = off || 0;
        return arr.map(function (v, i) { return (i === 0 ? 'M' : 'L') + x(i + off) + ',' + y(v); }).join(' ');
      };
      var kids = [];
      kids.push(React.createElement('defs', { key: 'd' }, React.createElement('linearGradient', { id: 'va-area-grad', x1: '0', y1: '0', x2: '0', y2: '1' },
        React.createElement('stop', { offset: '0', stopColor: 'var(--chart-1)', stopOpacity: '0.12' }),
        React.createElement('stop', { offset: '1', stopColor: 'var(--chart-1)', stopOpacity: '0' }))));
      kids.push(React.createElement('g', { key: 'g', className: 'va-chart__grid' }, [0, 0.25, 0.5, 0.75, 1].map(function (t) {
        return React.createElement('line', { key: t, x1: 0, x2: w, y1: padTop + plotH * t, y2: padTop + plotH * t, strokeDasharray: '2 3' });
      })));
      if (target != null) kids.push(React.createElement('line', { key: 'alvo', className: 'va-chart__line--target', x1: 0, x2: w, y1: y(target), y2: y(target) }));
      if (area && realized.length > 1) kids.push(React.createElement('path', {
        key: 'a', className: 'va-chart__area',
        d: path(realized) + ' L' + x(last) + ',' + (padTop + plotH) + ' L' + x(0) + ',' + (padTop + plotH) + ' Z'
      }));
      if (forecast.length > 1) kids.push(React.createElement('path', { key: 'f', className: 'va-chart__line va-chart__line--forecast', d: path(forecast, last) }));
      if (realized.length > 1) kids.push(React.createElement('path', { key: 'l', className: 'va-chart__line', d: path(realized), style: { stroke: 'var(--chart-1)' } }));
      if (last >= 0) kids.push(React.createElement('circle', { key: 'm', className: 'va-chart__marker', cx: x(last), cy: y(realized[last]), r: 3.2 }));
      var kidsWrap = [React.createElement('svg', { key: 's', viewBox: '0 0 ' + w + ' ' + height, preserveAspectRatio: 'xMinYMin meet', style: { height: height, width: '100%' } }, kids)];
      if (labels.length) kidsWrap.push(React.createElement('div', { key: 'lb', style: { position: 'relative', height: 14, marginTop: 6 } }, labels.map(function (l, i) {
        return React.createElement('span', {
          key: l,
          style: { position: 'absolute', left: x(i), transform: 'translateX(-50%)', font: '400 var(--type-caption-size)/1 var(--font-ui)', color: 'var(--data-axis)', whiteSpace: 'nowrap' }
        }, l);
      })));
      kidsWrap.push(React.createElement('div', { key: 'lg', className: 'va-chart__legend' },
        React.createElement('span', { key: '1' }, React.createElement('i', { className: 'va-chart__swatch', style: { background: 'var(--chart-1)' } }), 'Realizado'),
        forecast.length > 1 ? React.createElement('span', { key: '2' }, React.createElement('i', { className: 'va-chart__swatch va-chart__swatch--dashed' }), 'Previsto') : null,
        target != null ? React.createElement('span', { key: '3' }, React.createElement('i', { className: 'va-chart__swatch', style: { background: 'var(--border-strong)' } }), 'Objetivo') : null
      ));
      return React.createElement('div', { className: 'va-chart', role: 'img', 'aria-label': props.ariaLabel || 'Evolução', ref: ref }, kidsWrap);
    };
  })();
})();
