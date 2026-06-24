// Shared language control for Tasqyn pages: English / Русский / Қазақша.
// The HTML is authored in Russian (the element's own text); `data-en` and
// `data-kk` hold the other two languages. Default language is English.
// Switching language stores the choice and RELOADS the page, so every part
// (including JS-rendered charts and the page <title>) comes back in that language.
(function () {
  'use strict';
  var LANGS = ['en', 'ru', 'kk'];
  var LABEL = { en: 'EN', ru: 'RU', kk: 'KK' };
  var NAME = { en: 'English', ru: 'Русский', kk: 'Қазақша' };

  var stored = null;
  try { stored = localStorage.getItem('tasqyn-lang'); } catch (e) { /* ignore */ }
  var LANG = LANGS.indexOf(stored) >= 0 ? stored : 'en';
  window.TASQYN_LANG = LANG;            // read synchronously by app.js

  function pick(node) {
    if (LANG === 'ru') return node.dataset.ru;
    if (LANG === 'kk') return node.dataset.kk || node.dataset.en || node.dataset.ru;
    return node.dataset.en || node.dataset.ru;
  }
  function applyStatic() {
    document.querySelectorAll('[data-en],[data-kk]').forEach(function (n) {
      if (n.dataset.ru === undefined) n.dataset.ru = n.innerHTML;
      n.innerHTML = pick(n);
    });
    document.documentElement.lang = LANG;
  }
  window.tasqynApplyStatic = applyStatic;

  function choose(l) {
    if (l === LANG) return;
    try { localStorage.setItem('tasqyn-lang', l); } catch (e) { /* ignore */ }
    location.reload();
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyStatic();

    // language selector (a small EN ▾ dropdown injected into #langSelect)
    var host = document.getElementById('langSelect');
    if (host) {
      host.innerHTML = '';
      var cur = document.createElement('button');
      cur.type = 'button'; cur.className = 'lang-cur';
      cur.innerHTML = LABEL[LANG] + ' <span class="caret">▾</span>';
      var menu = document.createElement('div'); menu.className = 'lang-menu';
      LANGS.forEach(function (l) {
        var o = document.createElement('button');
        o.type = 'button'; o.className = 'lang-opt' + (l === LANG ? ' on' : '');
        o.textContent = NAME[l];
        o.addEventListener('click', function () { choose(l); });
        menu.appendChild(o);
      });
      host.appendChild(cur); host.appendChild(menu);
      cur.addEventListener('click', function (e) { e.stopPropagation(); host.classList.toggle('open'); });
      document.addEventListener('click', function () { host.classList.remove('open'); });
    }

    // mobile menu
    var burger = document.getElementById('navBurger');
    var links = document.querySelector('.navlinks');
    if (burger && links) {
      burger.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open);
      });
    }

    // scroll reveal (covers static pages; app.js adds its own targets too)
    var rv = document.querySelectorAll('.reveal');
    if (rv.length) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      rv.forEach(function (n) { io.observe(n); });
    }
  });
})();
