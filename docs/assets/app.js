(function () {
  var tabs = document.querySelector('.tabs');
  var tabsInner = tabs && tabs.querySelector('.tabs-inner');
  var head = document.querySelector('.page-head');

  function centerTab(btn) {
    if (!tabsInner || !btn) return;
    var left = btn.offsetLeft - (tabsInner.clientWidth - btn.offsetWidth) / 2;
    if (tabsInner.scrollTo) tabsInner.scrollTo({ left: left });
    else tabsInner.scrollLeft = left;
  }

  function showChapter(id, btn, keepScroll) {
    var target = document.getElementById(id);
    if (!target || !target.classList.contains('section')) return;
    document.querySelectorAll('.section').forEach(function (s) { s.classList.remove('visible'); });
    target.classList.add('visible');
    document.querySelectorAll('.tabs button[data-chapter]').forEach(function (b) {
      var on = b.getAttribute('data-chapter') === id;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on && !btn) btn = b;
    });
    centerTab(btn);
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    if (!keepScroll) {
      /* se la pagina è già scesa oltre l'intestazione, riparti dall'inizio del capitolo */
      var top = head ? head.offsetHeight : 0;
      if (window.scrollY > top) window.scrollTo(0, top);
    }
  }

  function showSub(id, btn) {
    var target = document.getElementById(id);
    if (!target) return;
    var chapter = target.closest('.section');
    chapter.querySelectorAll('.sub-section').forEach(function (s) { s.classList.remove('visible'); });
    target.classList.add('visible');
    btn.closest('.sub-nav').querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
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
  if (hash && document.getElementById(hash)) showChapter(hash, null, true);
  else {
    var sel = document.querySelector('.tabs button[aria-selected="true"]');
    if (sel) centerTab(sel);
  }
})();
