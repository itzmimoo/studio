(function () {
  var tabs = document.querySelector('.tabs');
  var inner = tabs && tabs.querySelector('.tabs-inner');
  var head = document.querySelector('.page-head');
  var sections = [].slice.call(document.querySelectorAll('.section'));
  if (!sections.length) return;
  var ids = sections.map(function (s) { return s.id; });

  function center(btn) {
    if (!inner || !btn) return;
    var left = btn.offsetLeft - (inner.clientWidth - btn.offsetWidth) / 2;
    if (inner.scrollTo) inner.scrollTo({ left: left, behavior: 'smooth' });
    else inner.scrollLeft = left;
  }

  function show(id, fromUser) {
    if (ids.indexOf(id) < 0) id = ids[0];
    sections.forEach(function (s) { s.classList.toggle('visible', s.id === id); });
    var sel = null;
    document.querySelectorAll('.tabs button[data-chapter]').forEach(function (b) {
      var on = b.getAttribute('data-chapter') === id;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on) sel = b;
    });
    center(sel);
    if (fromUser) {
      history.replaceState(null, '', '#' + id);
      /* riparti dall'inizio del capitolo, appena sotto la barra */
      var top = head ? head.offsetHeight + head.offsetTop : 0;
      if (window.scrollY > top) window.scrollTo(0, top);
    }
  }

  function showSub(id, btn) {
    var target = document.getElementById(id);
    if (!target) return;
    target.closest('.section').querySelectorAll('.sub-section').forEach(function (s) { s.classList.remove('visible'); });
    target.classList.add('visible');
    btn.closest('.sub-nav').querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-chapter],[data-sub]');
    if (!t) return;
    if (t.hasAttribute('data-chapter')) show(t.getAttribute('data-chapter'), true);
    else showSub(t.getAttribute('data-sub'), t);
  });

  window.addEventListener('hashchange', function () { show(decodeURIComponent(location.hash.slice(1)), false); });
  show(decodeURIComponent(location.hash.slice(1)), false);
})();
