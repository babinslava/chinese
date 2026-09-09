/*
 * Spaced repetition, SM-2 with the usual simplifications.
 *
 * State lives in localStorage under one key, so review history survives
 * reloads and is shared between the deck list and the study screen. There is
 * no server: this is a static site, and the schedule is personal anyway.
 *
 * Per card we keep:
 *   ef   ease factor, 1.3 … 2.8   (how quickly intervals grow)
 *   n    consecutive correct answers
 *   iv   current interval in days
 *   due  timestamp (ms) when it next comes up
 *   seen total reviews, for statistics
 */
(function () {
  var KEY = 'zh-srs-v1';
  var DAY = 86400000;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{}');
    } catch (e) {
      return {};
    }
  }
  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* private mode or quota — reviews just won't persist */
    }
  }

  function startOfTomorrow() {
    var d = new Date();
    d.setHours(24, 0, 0, 0);
    return d.getTime();
  }

  /**
   * Grade a card. quality: 0 again, 3 hard, 4 good, 5 easy.
   * Returns the updated record.
   */
  function grade(state, id, quality) {
    var c = state[id] || { ef: 2.5, n: 0, iv: 0, due: 0, seen: 0 };
    c.seen = (c.seen || 0) + 1;

    if (quality < 3) {
      // Lapse: back to the start, and it comes round again this session.
      c.n = 0;
      c.iv = 0;
      c.due = Date.now();
    } else {
      c.n += 1;
      if (c.n === 1) c.iv = 1;
      else if (c.n === 2) c.iv = 6;
      else c.iv = Math.round(c.iv * c.ef);
      // SM-2 ease update, clamped so a run of "hard" cannot collapse it.
      c.ef = c.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      if (c.ef < 1.3) c.ef = 1.3;
      if (c.ef > 2.8) c.ef = 2.8;
      c.due = Date.now() + c.iv * DAY;
    }
    state[id] = c;
    save(state);
    return c;
  }

  function isDue(state, id, now) {
    var c = state[id];
    if (!c) return true; // never seen — always due
    return (c.due || 0) <= now;
  }

  /** Counts for a set of card ids: new, due for review, and scheduled ahead. */
  function stats(state, ids) {
    var now = Date.now();
    var fresh = 0, due = 0, later = 0, learned = 0;
    ids.forEach(function (id) {
      var c = state[id];
      if (!c || !c.seen) { fresh++; return; }
      if (c.n >= 3) learned++;
      if ((c.due || 0) <= now) due++; else later++;
    });
    return { total: ids.length, fresh: fresh, due: due, later: later, learned: learned };
  }

  function resetDeck(state, ids) {
    ids.forEach(function (id) { delete state[id]; });
    save(state);
  }

  window.SRS = {
    load: load,
    save: save,
    grade: grade,
    isDue: isDue,
    stats: stats,
    resetDeck: resetDeck,
    startOfTomorrow: startOfTomorrow,
    DAY: DAY
  };
})();
