/*
 * "Моя колода" — a personal card list, kept in localStorage.
 *
 * Modelled on how Pleco and Skritter work: a word is added with one tap from
 * wherever it appears, duplicates are rejected, and the list is exportable so
 * it is not trapped in one browser.
 */
(function () {
  var KEY = 'zh-mydeck-v1';

  function load() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  }
  function save(ids) {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch (e) { /* private mode */ }
    document.dispatchEvent(new CustomEvent('mydeck:change', { detail: { count: ids.length } }));
  }

  function has(id) { return load().indexOf(id) !== -1; }

  function toggle(id) {
    var ids = load();
    var i = ids.indexOf(id);
    if (i === -1) ids.push(id); else ids.splice(i, 1);
    save(ids);
    return i === -1;
  }

  function remove(id) {
    var ids = load().filter(function (x) { return x !== id; });
    save(ids);
  }

  function clear() { save([]); }

  /** Wire every [data-star] button on the page to the deck. */
  function bindStars() {
    var ids = load();
    document.querySelectorAll('[data-star]').forEach(function (btn) {
      var id = btn.getAttribute('data-star');
      var on = ids.indexOf(id) !== -1;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.title = on ? 'Убрать из моей колоды' : 'Добавить в мою колоду';
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var added = toggle(id);
        btn.classList.toggle('on', added);
        btn.setAttribute('aria-pressed', added ? 'true' : 'false');
        btn.title = added ? 'Убрать из моей колоды' : 'Добавить в мою колоду';
      });
    });
  }

  window.MyDeck = {
    load: load, save: save, has: has, toggle: toggle,
    remove: remove, clear: clear, bindStars: bindStars, KEY: KEY
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindStars);
  } else {
    bindStars();
  }
})();
