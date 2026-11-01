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
    slot.setAttribute('data-file', '' + (p.panel || p.hero));
    img.alt = p.alt;
    img.src = '' + (p.panel || p.hero);
    kind.textContent = p.kind;
    line.textContent = p.line;
    proof.textContent = p.proof;
    link.href = '' + slug + '.html';
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

// Any button with data-dialog="id" opens that dialog (used by the Work icon).
(function () {
  document.querySelectorAll('[data-dialog]').forEach(function (btn) {
    var dlg = document.getElementById(btn.getAttribute('data-dialog'));
    if (!dlg) return;
    btn.addEventListener('click', function () { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); });
    dlg.querySelectorAll('[data-close]').forEach(function (c) { c.addEventListener('click', function () { dlg.close(); }); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { btn.focus({ preventScroll: true }); });
  });
})();

/* Intro reveal: plays once per visit, any click, key, scroll or tap skips it */
(function(){
  var el=document.getElementById('intro'); if(!el) return;
  var root=document.documentElement;
  if(!root.classList.contains('intro-on')){ el.remove(); return; }
  var done=false;
  function leave(){
    if(done) return; done=true;
    try{ sessionStorage.setItem('introSeen','1'); }catch(e){}
    el.classList.add('leave');
    setTimeout(function(){ root.classList.remove('intro-on'); el.remove(); }, 820);
  }
  setTimeout(leave, 1900);
  ['click','keydown','wheel','touchstart'].forEach(function(ev){ window.addEventListener(ev, leave, {once:true, passive:true}); });
})();

/* ---------- Menu bar: Say hello button + mobile menu ---------- */
(function(){
  var head=document.querySelector('.site-head .wrap'); if(!head) return;
  var nav=head.querySelector('.nav');
  var mail='mailto:ethan_charalambous@outlook.com';
  var hello=document.createElement('a'); hello.className='hello'; hello.href=mail;
  hello.innerHTML='<span class="dot-live" aria-hidden="true"></span>Say hello';
  head.appendChild(hello);
  var btn=document.createElement('button'); btn.className='menu-btn'; btn.type='button'; btn.textContent='Menu';
  btn.setAttribute('aria-expanded','false'); head.appendChild(btn);
  var panel=document.createElement('div'); panel.className='menu-panel'; panel.setAttribute('role','dialog'); panel.setAttribute('aria-label','Menu');
  var links=nav?Array.prototype.map.call(nav.querySelectorAll('a'),function(a){return '<a href="'+a.getAttribute('href')+'">'+a.textContent+'</a>';}).join(''):'';
  panel.innerHTML='<button class="mp-close" type="button">Close</button>'+links+'<a class="mp-mail" href="'+mail+'">ethan_charalambous@outlook.com</a>';
  document.body.appendChild(panel);
  function set(o){panel.classList.toggle('open',o);btn.setAttribute('aria-expanded',o?'true':'false');document.documentElement.style.overflow=o?'hidden':'';}
  btn.addEventListener('click',function(){set(true);});
  panel.querySelector('.mp-close').addEventListener('click',function(){set(false);});
  panel.addEventListener('click',function(e){if(e.target.tagName==='A')set(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});
  var sh=document.querySelector('.site-head');
  window.addEventListener('scroll',function(){sh.classList.toggle('scrolled',window.scrollY>8);},{passive:true});
})();

/* ---------- Custom cursor (mouse only) ---------- */
(function(){
  if(!window.matchMedia||!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var c=document.createElement('div'); c.className='cursor'; c.innerHTML='<span>View</span>'; document.body.appendChild(c);
  var x=0,y=0,tx=0,ty=0;
  window.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;c.classList.add('on');},{passive:true});
  document.addEventListener('mouseleave',function(){c.classList.remove('on');});
  (function loop(){x+=(tx-x)*.22;y+=(ty-y)*.22;c.style.transform='translate('+x+'px,'+y+'px)';requestAnimationFrame(loop);})();
  document.addEventListener('mouseover',function(e){c.classList.toggle('big',!!(e.target.closest&&e.target.closest('.item, .next, .gallery a, .zoom')));});
})();

/* ---------- Scroll reveals ---------- */
(function(){
  if(!('IntersectionObserver' in window)) return;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els=document.querySelectorAll('.chapter, .gallery figure, .stats .stat, .concepts .concept, .field .item, .facts, .posts li');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.08});
  els.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<window.innerHeight*0.92)return;el.classList.add('rv');io.observe(el);});
})();
