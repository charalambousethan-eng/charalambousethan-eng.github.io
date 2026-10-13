// Image slots: if a picture hasn't been added yet, show its file name instead.
(function () {
  function mark(img) {
    var s = img.closest('.slot');
    if (s) s.classList.add('empty');
  }
  document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') mark(e.target);
  }, true);
  document.querySelectorAll('.slot img').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) mark(img);
  });
})();

// Homepage: click an object to open its panel.
(function () {
  var panel = document.getElementById('panel');
  if (!panel) return;
  var scrim = document.getElementById('scrim');
  var data = JSON.parse(document.getElementById('projects').textContent);
  var lastBtn = null;
  var big = panel.querySelector('.big');
  var img = panel.querySelector('.stage img');
  var slot = panel.querySelector('.stage .slot');
  var kind = panel.querySelector('[data-kind]');
  var line = panel.querySelector('[data-line]');
  var proof = panel.querySelector('[data-proof]');
  var link = panel.querySelector('[data-link]');
  var closeBtn = panel.querySelector('.close');

  function open(slug, btn) {
    var p = data[slug];
    if (!p) return;
    lastBtn = btn;
    panel.style.setProperty('--accent', p.accent);
    big.textContent = p.name;
    slot.classList.remove('empty');
    slot.setAttribute('data-file', 'img/' + p.hero);
    img.alt = p.alt;
    img.src = 'img/' + p.hero;
    kind.textContent = p.kind;
    line.textContent = p.line;
    proof.textContent = p.proof;
    link.href = 'work/' + slug + '.html';
    link.setAttribute('aria-label', 'Read the ' + p.name + ' story');
    panel.setAttribute('data-open', 'true');
    panel.removeAttribute('inert');
    panel.setAttribute('aria-hidden', 'false');
    scrim.setAttribute('data-open', 'true');
    closeBtn.focus({ preventScroll: true });
  }
  function close() {
    panel.setAttribute('data-open', 'false');
    panel.setAttribute('inert', '');
    panel.setAttribute('aria-hidden', 'true');
    scrim.setAttribute('data-open', 'false');
    if (lastBtn) lastBtn.focus({ preventScroll: true });
  }
  document.querySelectorAll('.item[data-slug]').forEach(function (b) {
    b.addEventListener('click', function () { open(b.dataset.slug, b); });
  });
  closeBtn.addEventListener('click', close);
  scrim.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.getAttribute('data-open') === 'true') close();
  });
})();

// About: click Ethan to open the about card.
(function () {
  var btn = document.getElementById('me-btn');
  var dlg = document.getElementById('about-dialog');
  if (!btn || !dlg) return;
  btn.addEventListener('click', function () {
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  });
  dlg.querySelector('[data-close]').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { btn.focus({ preventScroll: true }); });
})();
