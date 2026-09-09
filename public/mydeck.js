/*
 * Personal card lists.
 *
 * Pleco and Skritter both let a word live in several user lists, and Skritter
 * advises keeping each list small (10–50). So this holds any number of named
 * decks rather than one bucket. The ★ button adds to whichever deck is
 * active; the active deck is chosen on /cards/my.
 *
 * v1 stored a flat array of ids under zh-mydeck-v1. That is migrated on first
 * read into a single deck named "Моя колода".
 */
(function () {
  var KEY = 'zh-mydeck-v2';
  var OLD = 'zh-mydeck-v1';

  function blank() {
    return { active: 'd1', decks: [{ id: 'd1', name: 'Моя колода', ids: [] }] };
  }

  function load() {
    var raw;
    try {
      raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    } catch (e) { raw = null; }

    if (!raw) {
      var legacy = null;
      try { legacy = JSON.parse(localStorage.getItem(OLD) || 'null'); } catch (e) {}
      raw = blank();
      if (Array.isArray(legacy) && legacy.length) {
        raw.decks[0].ids = legacy;
        save(raw);
      }
    }
    if (!raw.decks || !raw.decks.length) raw = blank();
    if (!raw.decks.some(function (d) { return d.id === raw.active; })) raw.active = raw.decks[0].id;
    return raw;
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    document.dispatchEvent(new CustomEvent('mydeck:change', { detail: state }));
  }

  function activeDeck(state) {
    state = state || load();
    return state.decks.filter(function (d) { return d.id === state.active; })[0] || state.decks[0];
  }

  /** Ids in the active deck (what ★ toggles against). */
  function ids() { return activeDeck().ids.slice(); }

  /** Ids in a named deck, by id. */
  function idsOf(deckId) {
    var d = load().decks.filter(function (x) { return x.id === deckId; })[0];
    return d ? d.ids.slice() : [];
  }

  function has(cardId) { return activeDeck().ids.indexOf(cardId) !== -1; }

  function toggle(cardId) {
    var state = load();
    var d = activeDeck(state);
    var i = d.ids.indexOf(cardId);
    if (i === -1) d.ids.push(cardId); else d.ids.splice(i, 1);
    save(state);
    return i === -1;
  }

  function remove(cardId, deckId) {
    var state = load();
    var d = deckId
      ? state.decks.filter(function (x) { return x.id === deckId; })[0]
      : activeDeck(state);
    if (!d) return;
    d.ids = d.ids.filter(function (x) { return x !== cardId; });
    save(state);
  }

  function addMany(cardIds, deckId) {
    var state = load();
    var d = deckId
      ? state.decks.filter(function (x) { return x.id === deckId; })[0]
      : activeDeck(state);
    if (!d) return 0;
    var added = 0;
    cardIds.forEach(function (id) {
      if (d.ids.indexOf(id) === -1) { d.ids.push(id); added++; }
    });
    save(state);
    return added;
  }

  function create(name) {
    var state = load();
    var id = 'd' + (Date.now().toString(36));
    state.decks.push({ id: id, name: name || 'Новая колода', ids: [] });
    state.active = id;
    save(state);
    return id;
  }

  function rename(deckId, name) {
    var state = load();
    state.decks.forEach(function (d) { if (d.id === deckId) d.name = name; });
    save(state);
  }

  function destroy(deckId) {
    var state = load();
    state.decks = state.decks.filter(function (d) { return d.id !== deckId; });
    if (!state.decks.length) state = blank();
    if (!state.decks.some(function (d) { return d.id === state.active; })) state.active = state.decks[0].id;
    save(state);
  }

  function setActive(deckId) {
    var state = load();
    if (state.decks.some(function (d) { return d.id === deckId; })) {
      state.active = deckId;
      save(state);
    }
  }

  function clear(deckId) {
    var state = load();
    var d = deckId
      ? state.decks.filter(function (x) { return x.id === deckId; })[0]
      : activeDeck(state);
    if (d) { d.ids = []; save(state); }
  }

  /** Wire every [data-star] button on the page to the active deck. */
  function bindStars() {
    var state = load();
    var d = activeDeck(state);
    document.querySelectorAll('[data-star]').forEach(function (btn) {
      var id = btn.getAttribute('data-star');
      var on = d.ids.indexOf(id) !== -1;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.title = (on ? 'Убрать из колоды «' : 'Добавить в колоду «') + d.name + '»';
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var added = toggle(id);
        var name = activeDeck().name;
        btn.classList.toggle('on', added);
        btn.setAttribute('aria-pressed', added ? 'true' : 'false');
        btn.title = (added ? 'Убрать из колоды «' : 'Добавить в колоду «') + name + '»';
      });
    });
  }

  window.MyDeck = {
    load: load, save: save, activeDeck: activeDeck,
    ids: ids, idsOf: idsOf, has: has, toggle: toggle, remove: remove, addMany: addMany,
    create: create, rename: rename, destroy: destroy, setActive: setActive,
    clear: clear, bindStars: bindStars, KEY: KEY
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindStars);
  } else {
    bindStars();
  }
  document.addEventListener('mydeck:change', function () { bindStars(); });
})();
