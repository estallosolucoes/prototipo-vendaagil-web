/* <va-select> — select customizado acessível (listbox ARIA) no padrão Venda Ágil.
   Atributos: label, options ("A|B|C"), value, help, required, disabled.
   Teclado: Tab, Enter/Espaço abre, setas navegam, Enter seleciona, Esc fecha. */
(function () {
  const S = {
    root: 'display:flex;flex-direction:column;gap:6px;font-family:&quot;IBM Plex Sans&quot;,system-ui,sans-serif;position:relative;width:100%',
    label: 'font:500 13px/1.3 &quot;IBM Plex Sans&quot;;color:#454F5E',
    btn: 'display:flex;align-items:center;gap:8px;width:100%;height:40px;padding:0 12px;background:#FFFFFF;border:1px solid #CFD6E1;border-radius:6px;cursor:pointer;font:400 14px/1.4 &quot;IBM Plex Sans&quot;;color:#021226;text-align:left;transition:border-color 120ms ease,box-shadow 120ms ease',
    btnFocus: 'border-color:#78A614;box-shadow:0 0 0 3px rgba(120,166,20,.18);outline:none',
    panel: 'position:absolute;left:0;right:0;z-index:60;margin:0;padding:6px;list-style:none;background:#FFFFFF;border:1px solid #E4E8EF;border-radius:10px;box-shadow:0 8px 24px rgba(2,18,38,.18);max-height:280px;overflow-y:auto;opacity:0;transform:translateY(-4px);transition:opacity 120ms ease,transform 120ms ease',
    item: 'display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 10px;border-radius:6px;cursor:pointer;white-space:nowrap;font:400 13.5px/1.4 &quot;IBM Plex Sans&quot;;color:#021226',
    help: 'font:400 12px/1.4 &quot;IBM Plex Sans&quot;;color:#5B6678',
  };
  const CHECK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const CHEV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B6678" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none;margin-left:auto"><path d="m6 9 6 6 6-6"/></svg>';
  let uid = 0;

  class VaSelect extends HTMLElement {
    static get observedAttributes() { return ['options', 'value', 'label', 'help', 'disabled']; }
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this._id = 'vas' + (++uid);
      this._options = (this.getAttribute('options') || '').split('|').map(s => s.trim()).filter(Boolean);
      this._value = this.getAttribute('value') || this._options[0] || '';
      this._open = false;
      this._active = Math.max(0, this._options.indexOf(this._value));
      this.render();
    }
    attributeChangedCallback(name, oldV, newV) {
      if (!this._built || oldV === newV || this._selecting) return;
      this._options = (this.getAttribute('options') || '').split('|').map(s => s.trim()).filter(Boolean);
      if (name === 'value' || this._options.indexOf(this._value) < 0) this._value = this.getAttribute('value') || this._options[0] || '';
      this._active = Math.max(0, this._options.indexOf(this._value));
      this._open = false;
      this.render();
    }
    render() {
      const label = this.getAttribute('label') || '';
      const help = this.getAttribute('help') || '';
      const req = this.hasAttribute('required') && this.getAttribute('required') !== 'false';
      const dis = this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false';
      this.innerHTML =
        '<div style="' + S.root + '">' +
        (label ? '<span id="' + this._id + '-l" style="' + S.label + '">' + label + (req ? ' <span style="color:#B3202F">*</span>' : '') + '</span>' : '') +
        '<button type="button" ' + (dis ? 'disabled ' : '') + 'aria-haspopup="listbox" aria-expanded="false" ' + (label ? 'aria-labelledby="' + this._id + '-l"' : '') + ' style="' + S.btn + (dis ? ';background:#EDF0F5;opacity:.7;cursor:not-allowed' : '') + '"><span data-val style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + this._esc(this._value) + '</span>' + CHEV + '</button>' +
        '<ul role="listbox" tabindex="-1" style="' + S.panel + ';display:none" ' + (label ? 'aria-labelledby="' + this._id + '-l"' : '') + '></ul>' +
        (help ? '<span style="' + S.help + '">' + help + '</span>' : '') +
        '</div>';
      this._btn = this.querySelector('button');
      this._list = this.querySelector('ul');
      this._val = this.querySelector('[data-val]');
      this._btn.addEventListener('click', () => this.toggle());
      this._btn.addEventListener('keydown', (e) => this.onKey(e));
      this._btn.addEventListener('focus', () => { this._btn.style.cssText = S.btn + ';' + S.btnFocus; });
      this._btn.addEventListener('blur', () => { this._btn.style.cssText = S.btn; setTimeout(() => { if (!this.contains(document.activeElement)) this.close(); }, 120); });
      document.addEventListener('click', (e) => { if (!this.contains(e.target)) this.close(); });
    }
    _esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
    buildItems() {
      this._list.innerHTML = '';
      this._options.forEach((op, i) => {
        const li = document.createElement('li');
        li.id = this._id + '-o' + i;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', op === this._value ? 'true' : 'false');
        li.style.cssText = S.item;
        li.innerHTML = '<span>' + this._esc(op) + '</span>' + (op === this._value ? '<span style="color:#F3F3F3">' + CHECK + '</span>' : '');
        li.addEventListener('mouseenter', () => { this._active = i; this.paintActive(); });
        li.addEventListener('mousedown', (e) => e.preventDefault());
        li.addEventListener('click', () => { this.select(i); });
        this._list.appendChild(li);
      });
      this.paintActive();
    }
    paintActive() {
      [...this._list.children].forEach((li, i) => {
        const sel = this._options[i] === this._value;
        li.style.background = sel ? '#78A614' : (i === this._active ? '#F2F8D4' : '#FFFFFF');
        li.style.color = sel ? '#F3F3F3' : '#021226';
        li.style.fontWeight = sel ? '600' : '400';
      });
      this._btn.setAttribute('aria-activedescendant', this._id + '-o' + this._active);
      const el = this._list.children[this._active];
      if (el && this._open) { const t = el.offsetTop, b = t + el.offsetHeight, st = this._list.scrollTop, h = this._list.clientHeight; if (t < st) this._list.scrollTop = t; else if (b > st + h) this._list.scrollTop = b - h; }
    }
    toggle() { this._open ? this.close() : this.open(); }
    open() {
      if (this._open || this._btn.disabled) return;
      this._open = true;
      this.buildItems();
      this._list.style.display = 'block';
      // position:fixed para nunca ser cortado por contêiner com overflow
      const r = this._btn.getBoundingClientRect();
      const below = window.innerHeight - r.bottom;
      this._list.style.position = 'fixed';
      this._list.style.left = r.left + 'px';
      // largura: nunca menor que o botão, mas cresce até caber a maior opção sem quebrar linha
      this._list.style.width = 'auto';
      this._list.style.minWidth = r.width + 'px';
      this._list.style.maxWidth = 'min(340px, calc(100vw - 16px))';
      this._list.style.whiteSpace = 'nowrap';
      this._list.style.right = 'auto';
      this._list.style.zIndex = '400';
      // se estourar a viewport à direita, realinha
      requestAnimationFrame(() => {
        const lr = this._list.getBoundingClientRect();
        if (lr.right > window.innerWidth - 8) this._list.style.left = Math.max(8, window.innerWidth - 8 - lr.width) + 'px';
      });
      if (below < 240 && r.top > 260) { this._list.style.top = 'auto'; this._list.style.bottom = (window.innerHeight - r.top + 4) + 'px'; }
      else { this._list.style.bottom = 'auto'; this._list.style.top = (r.bottom + 4) + 'px'; }
      this._onScroll = (e) => { if (e && e.target instanceof Node && (e.target === this._list || this._list.contains(e.target))) return; this.close(); };
      window.addEventListener('scroll', this._onScroll, true);
      window.addEventListener('resize', this._onScroll);
      requestAnimationFrame(() => { this._list.style.opacity = '1'; this._list.style.transform = 'translateY(0)'; });
      this._btn.setAttribute('aria-expanded', 'true');
    }
    close() {
      if (!this._open) return;
      this._open = false;
      if (this._onScroll) { window.removeEventListener('scroll', this._onScroll, true); window.removeEventListener('resize', this._onScroll); this._onScroll = null; }
      this._list.style.opacity = '0'; this._list.style.transform = 'translateY(-4px)';
      setTimeout(() => { if (!this._open) this._list.style.display = 'none'; }, 120);
      this._btn.setAttribute('aria-expanded', 'false');
    }
    select(i) {
      this._value = this._options[i];
      this._active = i;
      this._val.textContent = this._value;
      this._selecting = true;
      this.setAttribute('value', this._value);
      this._selecting = false;
      this.dispatchEvent(new CustomEvent('change', { detail: { value: this._value }, bubbles: true }));
      this.close();
      this._btn.focus();
    }
    onKey(e) {
      const k = e.key;
      if (!this._open && (k === 'Enter' || k === ' ' || k === 'ArrowDown' || k === 'ArrowUp')) { e.preventDefault(); this.open(); return; }
      if (!this._open) return;
      if (k === 'Escape') { e.preventDefault(); this.close(); }
      else if (k === 'ArrowDown') { e.preventDefault(); this._active = Math.min(this._options.length - 1, this._active + 1); this.paintActive(); }
      else if (k === 'ArrowUp') { e.preventDefault(); this._active = Math.max(0, this._active - 1); this.paintActive(); }
      else if (k === 'Home') { e.preventDefault(); this._active = 0; this.paintActive(); }
      else if (k === 'End') { e.preventDefault(); this._active = this._options.length - 1; this.paintActive(); }
      else if (k === 'Enter' || k === ' ') { e.preventDefault(); this.select(this._active); }
      else if (k === 'Tab') { this.close(); }
    }
  }
  if (!customElements.get('va-select')) customElements.define('va-select', VaSelect);
})();
