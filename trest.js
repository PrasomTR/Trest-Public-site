// Trest — minimal: staggered reveal + clickable news items.
(function () {
  'use strict';

  // staggered fade-up
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  var i = 0;
  document.querySelectorAll('.rv').forEach(function (n) {
    n.style.transitionDelay = Math.min(i++, 5) * 60 + 'ms';
    io.observe(n);
  });

  // clickable items navigate to data-href (keyboard accessible)
  document.querySelectorAll('.item.link[data-href]').forEach(function (el) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'link');
    var go = function () { window.location.href = el.dataset.href; };
    el.addEventListener('click', function (e) { if (e.target.tagName !== 'A') go(); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });
})();

// EN/RU language toggle for Trest only (English base; data-ru holds Russian).
(function () {
  'use strict';
  var LANG = 'en';
  try { if (localStorage.getItem('trest-lang') === 'ru') LANG = 'ru'; } catch (e) {}
  function apply() {
    document.querySelectorAll('[data-ru]').forEach(function (n) {
      if (n.dataset.en === undefined) n.dataset.en = n.innerHTML;
      n.innerHTML = LANG === 'ru' ? n.dataset.ru : n.dataset.en;
    });
    document.documentElement.lang = LANG;
  }
  var btn = document.getElementById('trestLang');
  function sync() { if (btn) btn.textContent = LANG === 'ru' ? 'EN' : 'RU'; }
  apply(); sync();
  if (btn) btn.addEventListener('click', function () {
    LANG = LANG === 'ru' ? 'en' : 'ru';
    try { localStorage.setItem('trest-lang', LANG); } catch (e) {}
    apply(); sync();
  });
})();
