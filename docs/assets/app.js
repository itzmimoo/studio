(function () {
  var tabs = document.querySelector('.tabs');
  var tabsInner = tabs && tabs.querySelector('.tabs-inner');

  function centerTab(btn) {
    if (!tabsInner) return;
    tabsInner.scrollLeft = btn.offsetLeft - (tabsInner.clientWidth - btn.offsetWidth) / 2;
  }

  function showChapter(id, btn, keepHash) {
    var target = document.getElementById(id);
    if (!target || !target.classList.contains('section')) return;
    document.querySelectorAll('.section').forEach(function (s) { s.classList.remove('visible'); });
    target.classList.add('visible');
    document.querySelectorAll('.tabs button').forEach(function (b) {
      var on = b.getAttribute('data-chapter') === id;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) { btn = btn || b; }
    });
    if (btn) centerTab(btn);
    if (!keepHash && history.replaceState) history.replaceState(null, '', '#' + id);
    // se si era già scesi oltre le tab, riparte dall'inizio del capitolo
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

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-chapter],[data-sub]');
    if (!t) return;
    if (t.hasAttribute('data-chapter')) showChapter(t.getAttribute('data-chapter'), t);
    else showSub(t.getAttribute('data-sub'), t);
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
