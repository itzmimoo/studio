(function () {
  var body = document.body;
  var sections = [].slice.call(document.querySelectorAll('.section'));
  var ids = sections.map(function (s) { return s.id; });
  if (!sections.length) return;

  var chev = function (d) {
    return '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  };

  /* barra di lettura: Indice | precedente  n / N  successivo */
  var bar = document.createElement('div');
  bar.className = 'chapbar';
  bar.innerHTML =
    '<div class="chapbar-in">' +
      '<button class="cb-index" type="button">' + chev('M12.5 4l-6 6 6 6') + 'Indice</button>' +
      '<div class="cb-nav">' +
        '<button class="cb-step cb-prev" type="button" aria-label="Capitolo precedente">' + chev('M12.5 4l-6 6 6 6') + '</button>' +
        '<span class="cb-count"></span>' +
        '<button class="cb-step cb-next" type="button" aria-label="Capitolo successivo">' + chev('M7.5 4l6 6-6 6') + '</button>' +
      '</div>' +
    '</div>';
  body.insertBefore(bar, body.firstChild);
  var count = bar.querySelector('.cb-count');
  var prev = bar.querySelector('.cb-prev');
  var next = bar.querySelector('.cb-next');

  function current() { return ids.indexOf(decodeURIComponent(location.hash.slice(1))); }

  function route() {
    var i = current();
    if (i < 0) {
      body.classList.remove('reading');
      sections.forEach(function (s) { s.classList.remove('visible'); });
      return;
    }
    body.classList.add('reading');
    sections.forEach(function (s, k) { s.classList.toggle('visible', k === i); });
    count.textContent = (i + 1) + ' / ' + ids.length;
    prev.disabled = i === 0;
    next.disabled = i === ids.length - 1;
    window.scrollTo(0, 0);
  }

  function open(id) { history.pushState({ ch: 1 }, '', '#' + id); route(); }
  function step(d) {
    var k = current() + d;
    if (k < 0 || k >= ids.length) return;
    history.replaceState({ ch: 1 }, '', '#' + ids[k]);
    route();
  }
  function toIndex() {
    if (history.state && history.state.ch) history.back();
    else { history.replaceState(null, '', location.pathname + location.search); route(); }
  }

  bar.querySelector('.cb-index').addEventListener('click', toIndex);
  prev.addEventListener('click', function () { step(-1); });
  next.addEventListener('click', function () { step(1); });

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
    if (t.hasAttribute('data-chapter')) open(t.getAttribute('data-chapter'));
    else showSub(t.getAttribute('data-sub'), t);
  });

  window.addEventListener('popstate', route);
  window.addEventListener('hashchange', route);
  route();
})();
