(function () {
  var tabs = document.querySelector('.tabs');
  var tabsInner = tabs && tabs.querySelector('.tabs-inner');

  function centerTab(btn) {
    if (!tabsInner || !btn) return;
    var drop = btn.closest('.tab-dropdown');
    var target = drop ? (drop.querySelector('.tab-dropdown-toggle') || btn) : btn;
    tabsInner.scrollLeft = target.offsetLeft - (tabsInner.clientWidth - target.offsetWidth) / 2;
  }

  function showChapter(id, btn, keepHash) {
    var target = document.getElementById(id);
    if (!target || !target.classList.contains('section')) return;
    document.querySelectorAll('.section').forEach(function (s) { s.classList.remove('visible'); });
    target.classList.add('visible');
    document.querySelectorAll('.tabs button[data-chapter]').forEach(function (b) {
      var on = b.getAttribute('data-chapter') === id;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) { btn = btn || b; }
    });
    if (btn) centerTab(btn);
    if (!keepHash && history.replaceState) history.replaceState(null, '', '#' + id);
    if (!keepHash) {
      var top = tabs ? tabs.offsetTop : 0;
      if (window.scrollY > top) window.scrollTo(0, top);
    }
  }

  function showSub(id, btn) {
    var target = document.getElementById(id);
    if (!target) return;
    var chapter = target.closest('.section');
    chapter.querySelectorAll('.sub-section').forEach(function (s) { s.classList.remove('visible'); });
    target.classList.add('visible');
    var nav = btn.closest('.sub-nav');
    nav.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
  }

  /* ---------- dropdown "1" ---------- */
  var dropdowns = Array.prototype.slice.call(document.querySelectorAll('.tab-dropdown'));

  var openScrollY = 0;
  var lastWidth = window.innerWidth;

  function closeDropdowns() {
    dropdowns.forEach(function (dd) {
      dd.classList.remove('open');
      var t = dd.querySelector('.tab-dropdown-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  function openDropdown(dd) {
    var toggle = dd.querySelector('.tab-dropdown-toggle');
    var menu = dd.querySelector('.tab-dropdown-menu');
    if (!toggle || !menu) return;
    closeDropdowns();
    dd.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    openScrollY = window.scrollY;

    /* il menu è position: fixed → va posizionato via JS.
       .tabs-inner ha overflow-x: auto, quindi il menu verrebbe
       tagliato se usasse position: absolute. */
    var r = toggle.getBoundingClientRect();
    var mw = menu.offsetWidth || 220;
    var left = r.left;
    var maxLeft = window.innerWidth - mw - 8;
    if (left > maxLeft) left = maxLeft;
    if (left < 8) left = 8;
    menu.style.top = (r.bottom + 4) + 'px';
    menu.style.left = left + 'px';
  }

  dropdowns.forEach(function (dd) {
    var toggle = dd.querySelector('.tab-dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (dd.classList.contains('open')) closeDropdowns();
      else openDropdown(dd);
    });
  });

  /* ---------- gestione click globale ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-chapter],[data-sub]');
    if (t) {
      if (t.hasAttribute('data-chapter')) {
        showChapter(t.getAttribute('data-chapter'), t);
        closeDropdowns();
      } else {
        showSub(t.getAttribute('data-sub'), t);
      }
      return;
    }
    if (!e.target.closest('.tab-dropdown')) closeDropdowns();
  });

  /* su mobile il browser genera scroll/resize "spuri" (barra indirizzi,
     tap sulla barra sticky): chiudo solo se la pagina si è mossa davvero */
  window.addEventListener('scroll', function () {
    if (Math.abs(window.scrollY - openScrollY) > 12) closeDropdowns();
  }, { passive: true });
  window.addEventListener('resize', function () {
    if (window.innerWidth !== lastWidth) { lastWidth = window.innerWidth; closeDropdowns(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDropdowns();
  });

  window.addEventListener('hashchange', function () {
    var h = location.hash.replace('#', '');
    if (h) showChapter(h, null, true);
  });

  var hash = location.hash.replace('#', '');
  if (hash) showChapter(hash, null, true);
  else {
    var sel = document.querySelector('.tabs button[aria-selected="true"]');
    if (sel) centerTab(sel);
  }
})();
