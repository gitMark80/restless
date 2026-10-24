// Restless.faith shared helpers, loaded on every page (the app and the static
// question/books pages). Plain script, no build step.
//
// 1. Conversion analytics through Vercel Web Analytics custom events (Pro).
//    Privacy: no IDs, no cookies, no question text. The only things kept on
//    the visitor's device are the coarse source of their FIRST visit
//    ("youtube", "google", ...) and how many visits they've made, so we can
//    ask "do YouTube visitors come back / ask more / click a book?" in
//    aggregate. Every event carries at most two properties (Pro plan limit).
// 2. Amazon link clicks anywhere on the site.
// 3. The newsletter signup form ([data-rf-newsletter]), which stays hidden
//    until /api/subscribe reports that an email service is connected.
(function () {
  "use strict";
  if (window.rfTrack) return;

  window.va =
    window.va ||
    function () {
      (window.vaq = window.vaq || []).push(arguments);
    };

  var SRC_KEY = "rf-first-source";
  var VISITS_KEY = "rf-visits";
  var SESSION_KEY = "rf-session";

  function store(kind) {
    try {
      var s = window[kind];
      var probe = "__rf";
      s.setItem(probe, "1");
      s.removeItem(probe);
      return s;
    } catch (e) {
      return null;
    }
  }
  var local = store("localStorage");
  var session = store("sessionStorage");

  // Where did this visit come from? ?s=yt is the short tag used in our own
  // video descriptions; utm_source works too; otherwise the referrer.
  var SHORT_TAGS = { yt: "youtube", fb: "facebook", ig: "instagram", tt: "tiktok", em: "email", x: "x" };
  function classify() {
    var params;
    try {
      params = new URLSearchParams(location.search);
    } catch (e) {
      params = null;
    }
    var tag = params && (params.get("s") || params.get("utm_source"));
    if (tag) {
      tag = String(tag).toLowerCase().slice(0, 24);
      return SHORT_TAGS[tag] || tag.replace(/[^a-z0-9_-]/g, "") || "other";
    }
    var ref = document.referrer || "";
    var host = "";
    try {
      host = ref ? new URL(ref).hostname.replace(/^www\./, "") : "";
    } catch (e) {
      host = "";
    }
    if (!host) return "direct";
    if (host === location.hostname) return "internal";
    if (/(^|\.)(youtube\.com|youtu\.be)$/.test(host)) return "youtube";
    if (/(^|\.)(facebook\.com|fb\.com|fb\.me)$|^l\.facebook|^lm\.facebook/.test(host)) return "facebook";
    if (/(^|\.)instagram\.com$/.test(host)) return "instagram";
    if (/(^|\.)tiktok\.com$/.test(host)) return "tiktok";
    if (/(^|\.)(t\.co|x\.com|twitter\.com)$/.test(host)) return "x";
    if (/(^|\.)reddit\.com$/.test(host)) return "reddit";
    if (/(^|\.)google\./.test(host)) return "google";
    if (/(^|\.)bing\.com$/.test(host)) return "bing";
    if (/duckduckgo|yahoo|ecosia|brave|search/.test(host)) return "search";
    if (/amazon\./.test(host)) return "amazon";
    return "other";
  }

  var firstSource = (local && local.getItem(SRC_KEY)) || "";
  var visits = 0;
  var newSession = !(session && session.getItem(SESSION_KEY));
  try {
    visits = parseInt((local && local.getItem(VISITS_KEY)) || "0", 10) || 0;
  } catch (e) {
    visits = 0;
  }
  if (newSession) {
    var now = classify();
    if (!firstSource) {
      firstSource = now === "internal" ? "direct" : now;
      if (local) local.setItem(SRC_KEY, firstSource);
    }
    visits += 1;
    if (local) local.setItem(VISITS_KEY, String(visits));
    if (session) session.setItem(SESSION_KEY, "1");
  }
  if (!firstSource) firstSource = "direct";

  function visitBucket(n) {
    if (n <= 1) return "1";
    if (n === 2) return "2";
    if (n <= 4) return "3-4";
    if (n <= 9) return "5-9";
    return "10+";
  }

  function clean(value) {
    return String(value == null ? "" : value).slice(0, 80);
  }

  // rfTrack("Question Asked", { via: "starter" }) -> event with {src, via}.
  window.rfTrack = function (name, data) {
    var payload = { src: firstSource };
    if (data) {
      for (var key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key) && key !== "src") {
          payload[key] = clean(data[key]);
          break; // one extra property: Vercel Pro allows two per event
        }
      }
    }
    try {
      window.va("event", { name: name, data: payload });
    } catch (e) {
      /* analytics must never break the page */
    }
    if (window.RF_DEBUG_EVENTS) window.RF_DEBUG_EVENTS.push([name, payload]);
  };
  window.rfSource = function () {
    return firstSource;
  };

  if (newSession && visits > 1) {
    window.rfTrack("Return Visit", { visit: visitBucket(visits) });
  }

  // Amazon clicks anywhere (app book cards, books page, topic pages).
  document.addEventListener(
    "click",
    function (event) {
      var link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
      if (!link) return;
      var href = link.getAttribute("href") || "";
      if (/amazon\.[a-z.]+\//i.test(href)) {
        var book = link.getAttribute("data-rf-book") || (href.match(/\/dp\/([A-Z0-9]{10})/i) || [])[1] || "unknown";
        window.rfTrack("Amazon Click", { book: book });
      }
      var related = link.getAttribute("data-rf-related");
      if (related) window.rfTrack("Related Clicked", { to: related });
      var ask = link.getAttribute("data-rf-ask");
      if (ask) window.rfTrack("Topic Ask Clicked", { topic: ask });
    },
    true
  );

  // Newsletter forms ---------------------------------------------------------
  var newsletterState = null; // null = unknown, true/false once checked
  function checkNewsletter(callback) {
    if (newsletterState !== null) return callback(newsletterState);
    try {
      fetch("/api/subscribe", { method: "GET", headers: { Accept: "application/json" } })
        .then(function (r) {
          return r.ok ? r.json() : { enabled: false };
        })
        .then(function (d) {
          newsletterState = !!(d && d.enabled);
          callback(newsletterState);
        })
        .catch(function () {
          newsletterState = false;
          callback(false);
        });
    } catch (e) {
      newsletterState = false;
      callback(false);
    }
  }
  window.rfNewsletterEnabled = checkNewsletter;

  function wireForm(form) {
    if (form.dataset.rfWired) return;
    form.dataset.rfWired = "1";
    var status = form.querySelector("[data-rf-status]");
    var button = form.querySelector("button[type=submit]");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = (form.querySelector("input[type=email]") || {}).value || "";
      var consent = (form.querySelector("input[name=consent]") || {}).checked;
      var trap = (form.querySelector("input[name=website]") || {}).value || "";
      var say = function (text, ok) {
        if (status) {
          status.textContent = text;
          status.dataset.ok = ok ? "1" : "0";
        }
      };
      if (!consent) return say("Please tick the box to confirm you'd like the emails.", false);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return say("Please enter a valid email address.", false);
      if (button) button.disabled = true;
      say("Sending…", true);
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent: true, website: trap, where: form.dataset.rfNewsletter || "page" }),
      })
        .then(function (r) {
          return r.json().catch(function () {
            return {};
          }).then(function (d) {
            return { ok: r.ok, d: d };
          });
        })
        .then(function (res) {
          if (button) button.disabled = false;
          if (res.ok) {
            form.reset();
            say("Almost done: check your inbox and tap the confirmation link.", true);
            window.rfTrack("Newsletter Subscribed", { where: form.dataset.rfNewsletter || "page" });
          } else {
            say((res.d && res.d.error) || "That didn't go through. Please try again.", false);
          }
        })
        .catch(function () {
          if (button) button.disabled = false;
          say("That didn't go through. Please try again.", false);
        });
    });
  }
  window.rfWireNewsletter = function (root) {
    var forms = (root || document).querySelectorAll("[data-rf-newsletter]");
    if (!forms.length) return;
    checkNewsletter(function (enabled) {
      for (var i = 0; i < forms.length; i++) {
        var holder = forms[i].closest("[data-rf-newsletter-box]") || forms[i];
        holder.hidden = !enabled;
        if (enabled) wireForm(forms[i]);
      }
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      window.rfWireNewsletter();
    });
  } else {
    window.rfWireNewsletter();
  }
})();
