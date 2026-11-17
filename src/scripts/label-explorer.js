// Label explorer: pick any product (or step through them) and its label facts appear in one card:
// serving, servings, form, highlights, composition per 100 g, flavours, what it is free from and how to take it.
// The data is the catalogue itself, written into the page as JSON.
const root = document.querySelector('[data-lx]');
if (root) {
  const data = JSON.parse(root.querySelector('[data-lx-data]').textContent);
  const bySlug = Object.fromEntries(data.map((p) => [p.slug, p]));
  const select = root.querySelector('[data-lx-select]');
  let card = root.querySelector('[data-lx-card]');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  const check = svg('M5 12.5l4.5 4.5L19 7');
  const chips = (list, icon = '') => `<ul class="lx-chips${icon ? ' lx-chips--ok' : ''}">${list.map((x) => `<li>${icon}${esc(x)}</li>`).join('')}</ul>`;
  const row = (title, body) => `<div class="lx-row"><h4>${title}</h4>${body}</div>`;

  const render = (p) => {
    const comp = p.comp
      ? `<div class="lx-row"><h4>Per 100 g</h4><div class="lx-bar" role="img" aria-label="${esc(p.comp.map((c) => `${c.name} ${c.g} g`).join(', '))}">${p.comp.map((c) => `<i class="t${c.tone}" style="flex-grow:${c.g}"></i>`).join('')}</div><ul class="lx-legend">${p.comp.map((c) => `<li><i class="t${c.tone}"></i>${esc(c.name)} <b>${esc(c.g)} g</b></li>`).join('')}</ul></div>`
      : '';
    /* a fresh element each time: re-filling the old one could leave it hidden by the page's text-reveal styles */
    const next = card.cloneNode(false);
    card.replaceWith(next);
    card = next;
    card.innerHTML = `
      <header class="lx-head">
        <img src="${esc(p.img)}" alt="" width="88" height="88" />
        <div><span class="lx-cat">${esc(p.cat)}</span><h3>${esc(p.name)}</h3><p>${esc(p.size)}</p></div>
      </header>
      <dl class="lx-facts">
        <div><dt>Serving</dt><dd>${esc(p.serving)}</dd></div>
        <div><dt>Servings</dt><dd>${esc(p.servings)}</dd></div>
        <div><dt>Form</dt><dd>${esc(p.form)}</dd></div>
      </dl>
      ${p.highlights.length ? `<ul class="lx-high">${p.highlights.map((h) => `<li>${check}<span>${esc(h)}</span></li>`).join('')}</ul>` : ''}
      ${comp}
      ${p.flavours.length ? row('Flavours', chips(p.flavours)) : ''}
      ${p.free.length ? row('Free from', chips(p.free, check)) : ''}
      ${p.how ? row('How to take it', `<p>${esc(p.how)}</p>`) : ''}
      <a class="btn lx-open" href="/products/${esc(p.slug)}/">Open the full label${svg('M4 12h15M13 6l6 6-6 6')}</a>`;
    if (!still) {
      card.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2, .8, .2, 1)' });
      card.querySelector('.lx-bar')?.animate([{ clipPath: 'inset(0 100% 0 0 round 999px)' }, { clipPath: 'inset(0 0 0 0 round 999px)' }], { duration: 700, delay: 120, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'backwards' });
    }
  };

  const show = () => render(bySlug[select.value]);
  select.addEventListener('change', show);
  root.querySelectorAll('[data-lx-step]').forEach((b) => b.addEventListener('click', () => {
    const n = select.options.length;
    select.selectedIndex = (select.selectedIndex + Number(b.dataset.lxStep) + n) % n;
    show();
  }));
  show();
}
