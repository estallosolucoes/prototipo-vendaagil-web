/* <va-buscar> — campo de busca com sugestões (combobox ARIA) no padrão Venda Ágil.
   Para dados de cadastro que crescem (clientes, representadas, produtos, tabelas, transportadoras):
   nunca lista tudo — o usuário digita e o sistema sugere. API igual à do <va-select>:
   label, options ("A|B|C"), value, help, required, disabled. Emite 'change' {detail:{value}}. */
(function () {
  const S = {
    root: 'display:flex;flex-direction:column;gap:6px;font-family:&quot;IBM Plex Sans&quot;,system-ui,sans-serif;position:relative;width:100%',
    label: 'font:500 13px/1.3 &quot;IBM Plex Sans&quot;;color:#454F5E',
    wrap: 'position:relative;display:flex;align-items:center',
    input: 'width:100%;height:40px;padding:0 30px 0 34px;background:#FFFFFF;border:1px solid #CFD6E1;border-radius:6px;font:400 14px/1.4 &quot;IBM Plex Sans&quot;;color:#021226;transition:border-color 120ms ease,box-shadow 120ms ease;box-sizing:border-box',
    inputFocus: 'border-color:#78A614;box-shadow:0 0 0 3px rgba(120,166,20,.18);outline:none',
    panel: 'position:fixed;z-index:400;margin:0;padding:6px;list-style:none;background:#FFFFFF;border:1px solid #E4E8EF;border-radius:10px;box-shadow:0 8px 24px rgba(2,18,38,.18);max-height:260px;overflow-y:auto',
    item: 'display:block;padding:9px 10px;border-radius:6px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:400 13.5px/1.4 &quot;IBM Plex Sans&quot;;color:#021226',
    help: 'font:400 12px/1.4 &quot;IBM Plex Sans&quot;;color:#5B6678',
    vazio: 'display:block;padding:10px;font:400 13px/1.4 &quot;IBM Plex Sans&quot;;color:#5B6678;white-space:normal',
  };
  const LUPA = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7A8699" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="position:absolute;left:11px;pointer-events:none"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';
  const MAX = 8;
  let uid = 0;

  class VaBuscar extends HTMLElement {
    static get observedAttributes() { return ['options', 'value', 'label', 'help', 'disabled']; }
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this._id = 'vab' + (++uid);
      this._sync();
      this.render();
    }
    _sync() {
      this._options = (this.getAttribute('options') || '').split('|').map(s => s.trim()).filter(Boolean);
      this._value = this.getAttribute('value') || '';
    }
    attributeChangedCallback(n, o, v) {
      if (!this._built || o === v || this._selecting) return;
      this._sync();
      if (this._input && document.activeElement !== this._input) this._input.value = this._value;
    }
    render() {
      const label = this.getAttribute('label') || '';
      const help = this.getAttribute('help') || '';
      const req = this.hasAttribute('required') && this.getAttribute('required') !== 'false';
      const dis = this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false';
      this.innerHTML =
        '<div style="' + S.root + '">' +
        (label ? '<span id="' + this._id + '-l" style="' + S.label + '">' + label + (req ? ' <span style="color:#B3202F">*</span>' : '') + '</span>' : '') +
        '<div style="' + S.wrap + '">' + LUPA +
        '<input role="combobox" aria-autocomplete="list" aria-expanded="false" ' + (label ? 'aria-labelledby="' + this._id + '-l" ' : '') + (dis ? 'disabled ' : '') + 'placeholder="Digite para buscar" style="' + S.input + (dis ? ';background:#EDF0F5;opacity:.7;cursor:not-allowed' : '') + '">' +
        '</div>' +
        '<ul role="listbox" style="' + S.panel + ';display:none"></ul>' +
        (help ? '<span style="' + S.help + '">' + help + '</span>' : '') +
        '</div>';
      this._input = this.querySelector('input');
      this._list = this.querySelector('ul');
      this._input.value = this._value;
      this._input.addEventListener('focus', () => { this._input.style.cssText = S.input + ';' + S.inputFocus; this._input.select(); this.open(''); });
      this._input.addEventListener('blur', () => {
        this._input.style.cssText = S.input;
        setTimeout(() => {
          if (this.contains(document.activeElement)) return;
          this.close();
          this._input.value = this._value; // sem escolha válida, volta ao valor atual
        }, 140);
      });
      this._input.addEventListener('input', () => this.open(this._input.value));
      this._input.addEventListener('keydown', (e) => this.onKey(e));
      document.addEventListener('click', (e) => { if (!this.contains(e.target)) this.close(); });
    }
    _esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
    open(q) {
      const query = (q || '').toLowerCase().trim();
      const achadas = query ? this._options.filter(o => o.toLowerCase().includes(query)) : this._options.slice();
      this._achadas = achadas.slice(0, MAX);
      this._resto = achadas.length - this._achadas.length;
      this._active = 0;
      this._list.innerHTML = '';
      if (achadas.length === 0) {
        const li = document.createElement('li');
        li.style.cssText = S.vazio;
        li.textContent = 'Nada encontrado com "' + (q || '') + '"';
        this._list.appendChild(li);
      } else {
        this._achadas.forEach((op, i) => {
          const li = document.createElement('li');
          li.id = this._id + '-o' + i;
          li.setAttribute('role', 'option');
          li.style.cssText = S.item;
          li.textContent = op;
          li.addEventListener('mouseenter', () => { this._active = i; this.paint(); });
          li.addEventListener('mousedown', (e) => e.preventDefault());
          li.addEventListener('click', () => this.select(i));
          this._list.appendChild(li);
        });
        if (this._resto > 0) {
          const li = document.createElement('li');
          li.style.cssText = S.vazio;
          li.textContent = '+ ' + this._resto + ' resultados — continue digitando para refinar';
          this._list.appendChild(li);
        }
      }
      const r = this._input.getBoundingClientRect();
      this._list.style.display = 'block';
      this._list.style.left = r.left + 'px';
      this._list.style.minWidth = r.width + 'px';
      this._list.style.maxWidth = 'min(360px, calc(100vw - 16px))';
      const below = window.innerHeight - r.bottom;
      if (below < 220 && r.top > 240) { this._list.style.top = 'auto'; this._list.style.bottom = (window.innerHeight - r.top + 4) + 'px'; }
      else { this._list.style.bottom = 'auto'; this._list.style.top = (r.bottom + 4) + 'px'; }
      if (!this._onScroll) {
        this._onScroll = (e) => { if (e && e.target instanceof Node && (e.target === this._list || this._list.contains(e.target))) return; this.close(); };
        window.addEventListener('scroll', this._onScroll, true);
        window.addEventListener('resize', this._onScroll);
      }
      this._input.setAttribute('aria-expanded', 'true');
      this.paint();
    }
    paint() {
      [...this._list.children].forEach((li, i) => {
        if (li.getAttribute('role') !== 'option') return;
        li.style.background = i === this._active ? '#F2F8D4' : '#FFFFFF';
      });
      this._input.setAttribute('aria-activedescendant', this._id + '-o' + this._active);
    }
    close() {
      this._list.style.display = 'none';
      if (this._onScroll) { window.removeEventListener('scroll', this._onScroll, true); window.removeEventListener('resize', this._onScroll); this._onScroll = null; }
      this._input.setAttribute('aria-expanded', 'false');
    }
    select(i) {
      const v = this._achadas[i];
      if (v === undefined) return;
      this._value = v;
      this._input.value = v;
      this._selecting = true;
      this.setAttribute('value', v);
      this._selecting = false;
      this.dispatchEvent(new CustomEvent('change', { detail: { value: v }, bubbles: true }));
      this.close();
    }
    onKey(e) {
      const k = e.key;
      const aberto = this._list.style.display !== 'none';
      if (!aberto && (k === 'ArrowDown' || k === 'Enter')) { e.preventDefault(); this.open(this._input.value); return; }
      if (!aberto) return;
      const n = (this._achadas || []).length;
      if (k === 'Escape') { e.preventDefault(); this.close(); }
      else if (k === 'ArrowDown') { e.preventDefault(); this._active = Math.min(n - 1, this._active + 1); this.paint(); }
      else if (k === 'ArrowUp') { e.preventDefault(); this._active = Math.max(0, this._active - 1); this.paint(); }
      else if (k === 'Enter') { e.preventDefault(); if (n > 0) this.select(this._active); }
      else if (k === 'Tab') { this.close(); }
    }
  }
  if (!customElements.get('va-buscar')) customElements.define('va-buscar', VaBuscar);
})();
