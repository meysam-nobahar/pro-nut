// Stack builder: goal tabs. Click or use the arrow keys; the chosen goal's panel shows and its cards animate in again.
document.querySelectorAll('[data-stack]').forEach((box) => {
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      box.querySelector('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, n) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (step) { e.preventDefault(); select(tabs[(n + step + tabs.length) % tabs.length], true); }
    });
  });
});
