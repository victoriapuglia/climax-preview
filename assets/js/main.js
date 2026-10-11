/* Climax — site behaviour. Business facts come from data/*.js */
(function () {
  "use strict";

  var C = window.CLIMAX || {};
  var S = C.site || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Facts from data/site.js ---------- */
  var addr = S.address || {};
  var facts = {
    address: [addr.street, addr.area, addr.city].filter(Boolean).join(", "),
    street: addr.street || "",
    phone: (S.phone && S.phone.display) || "",
    hours: S.hours || "",
    price: S.priceRange || "",
    rating: S.rating ? S.rating.score : "",
    reviews: S.rating ? S.rating.count : "",
    email: S.email || "",
    year: String(new Date().getFullYear())
  };
  var links = {
    tel: S.phone && S.phone.international ? "tel:" + S.phone.international : "",
    maps: S.mapsUrl || "",
    whatsapp: S.whatsapp && S.whatsapp.number ? "https://wa.me/" + S.whatsapp.number : "",
    email: S.email ? "mailto:" + S.email : ""
  };

  $$("[data-bind]").forEach(function (el) {
    var v = facts[el.getAttribute("data-bind")];
    if (v) el.textContent = v;
  });
  $$("[data-href]").forEach(function (el) {
    var v = links[el.getAttribute("data-href")];
    if (v) el.setAttribute("href", v);
    else {
      el.classList.add("is-empty");
      var row = el.closest(".facts li, .footer-grid li");
      if (row) row.classList.add("is-empty");
    }
  });
  $$("[data-social]").forEach(function (list) {
    var social = S.social || {};
    var labels = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok", x: "X" };
    list.innerHTML = Object.keys(labels).filter(function (k) { return social[k]; }).map(function (k) {
      return '<li><a href="' + esc(social[k]) + '" target="_blank" rel="noopener">' + labels[k] + "</a></li>";
    }).join("");
    var block = list.closest("[data-social-block]");
    if (block && !list.children.length) block.classList.add("is-empty");
  });

  /* ---------- Header: scrolled state + tone ---------- */
  var header = $(".site-header");
  var toned = $$("[data-tone]").filter(function (el) { return el !== header; });
  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
    var probe = header.offsetHeight / 2;
    var tone = "night";
    for (var i = 0; i < toned.length; i++) {
      var r = toned[i].getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) { tone = toned[i].getAttribute("data-tone"); break; }
    }
    header.setAttribute("data-tone", tone);
  }

  /* ---------- Overlay menu ---------- */
  var overlay = $(".overlay");
  var toggle = $(".menu-toggle");
  if (overlay && toggle) {
    var closeBtn = $(".overlay-close", overlay);
    var setOpen = function (open) {
      overlay.classList.toggle("is-open", open);
      overlay.setAttribute("aria-hidden", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
      if (open) closeBtn.focus(); else toggle.focus();
    };
    toggle.addEventListener("click", function () { setOpen(true); });
    closeBtn.addEventListener("click", function () { setOpen(false); });
    $$("a", overlay).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) setOpen(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Day → night clock + dusk + parallax ---------- */
  var clock = $(".clock");
  var clockTime = clock ? $("[data-clock-time]", clock) : null;
  var clockLabel = clock ? $("[data-clock-label]", clock) : null;
  var dusk = $(".dusk");
  var parallax = $$("[data-parallax]");

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function updateScene() {
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    var progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

    if (clock) {
      // 11:00 at the top of the page, 03:00 at the bottom (16 hours).
      var mins = Math.round((11 * 60 + progress * 16 * 60) / 15) * 15;
      var h = Math.floor(mins / 60) % 24;
      var m = mins % 60;
      var isNight = h >= 19 || h < 6;
      clockTime.textContent = pad(h) + ":" + pad(m);
      clockLabel.textContent = h >= 0 && h < 6 ? "still open" : isNight ? "after dark" : h >= 16 ? "golden hour" : "daytime";
      clock.classList.toggle("is-night", isNight);
      clock.classList.toggle("is-visible", window.scrollY > vh * 0.6);
    }

    if (dusk && !reduceMotion) {
      var r = dusk.getBoundingClientRect();
      var span = r.height - vh;
      var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      dusk.style.setProperty("--p", p.toFixed(3));
    }

    if (!reduceMotion) {
      parallax.forEach(function (el) {
        var box = el.parentElement.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) return;
        var t = (box.top + box.height / 2 - vh / 2) / vh; // -1 … 1
        el.style.setProperty("--parallax", (-6 + t * -6).toFixed(2) + "%");
      });
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateHeader(); updateScene(); ticking = false; });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateHeader();
  updateScene();

  /* ---------- Gallery strip buttons ---------- */
  var strip = $(".strip");
  if (strip) {
    $$("[data-strip]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = btn.getAttribute("data-strip") === "next" ? 1 : -1;
        var card = strip.querySelector("figure");
        var step = card ? card.getBoundingClientRect().width + 16 : 400;
        strip.scrollBy({ left: dir * step, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
  }

  /* ---------- This week (data/events.js) — shown only when real events exist ---------- */
  var lineup = $("[data-lineup]");
  if (lineup) {
    var rows = (C.events && C.events.items) || [];
    if (rows.length) {
      lineup.innerHTML = rows.map(function (e) {
        return "<li>" +
          '<span class="lu-day">' + esc(e.day || "") + (e.date ? " " + esc(e.date) : "") + "</span>" +
          '<span class="lu-title">' + esc(e.title || "") + "</span>" +
          '<span class="lu-time">' + esc(e.time || "") + "</span>" +
          '<span class="lu-tag">' + esc(e.tag || "") + "</span>" +
          "</li>";
      }).join("");
      lineup.hidden = false;
    }
  }

  /* ---------- Menu (data/menu.js) ---------- */
  var menuRoot = $("[data-menu]");
  if (menuRoot) {
    var menu = C.menu || { categories: [] };
    var cats = (menu.categories || []).filter(function (c) { return c.items && c.items.length; });
    var empty = $("[data-menu-empty]");
    var nav = $("[data-menu-nav]");
    if (cats.length) {
      if (empty) empty.hidden = true;
      nav.innerHTML = cats.map(function (c) {
        return '<a href="#' + esc(c.id) + '">' + esc(c.title) + "</a>";
      }).join("");
      menuRoot.innerHTML = cats.map(function (c) {
        return '<section class="menu-cat" id="' + esc(c.id) + '"><h2 class="h2">' + esc(c.title) + '</h2><ul class="menu-items">' +
          c.items.map(function (it) {
            var price = typeof it.price === "number" ? "UGX " + it.price.toLocaleString("en-GB") : "Ask staff";
            return '<li class="' + (it.soldOut ? "is-out" : "") + '"><span class="mi-name">' + esc(it.name) + '</span><span class="mi-price">' + price + "</span>" +
              (it.description ? '<p class="mi-desc">' + esc(it.description) + "</p>" : "") + "</li>";
          }).join("") + "</ul></section>";
      }).join("");
      var upd = $("[data-menu-updated]");
      if (upd && menu.lastUpdated) { upd.textContent = "Menu last updated " + menu.lastUpdated + ". Prices in Ugandan shillings."; upd.hidden = false; }
    } else if (nav) {
      nav.hidden = true;
    }
  }

  /* ---------- Booking form → WhatsApp ---------- */
  var form = $("[data-booking]");
  if (form) {
    var dateInput = $("#b-date", form);
    if (dateInput) {
      var today = new Date();
      dateInput.min = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate());
    }
    var status = $("[data-form-status]");
    var errorBox = $("[data-form-error]");
    var waConfirmed = S.whatsapp && S.whatsapp.confirmed;
    var waBtn = $("[data-wa-submit]", form);
    if (!links.whatsapp && waBtn) waBtn.hidden = true;
    if (!waConfirmed) {
      var hint = $("[data-wa-hint]");
      if (hint) hint.hidden = false;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      errorBox.textContent = "";
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var get = function (id) { var el = $("#" + id, form); return el ? el.value.trim() : ""; };
      var d = get("b-date");
      var niceDate = d ? new Date(d + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "";
      var lines = [
        "Hello Climax, I'd like to book a table.",
        "",
        "Name: " + get("b-name"),
        "Date: " + niceDate,
        "Time: " + get("b-time"),
        "Guests: " + get("b-guests"),
        get("b-area") ? "Seating: " + get("b-area") : "",
        get("b-occasion") ? "Occasion: " + get("b-occasion") : "",
        get("b-note") ? "Note: " + get("b-note") : ""
      ].filter(function (l, i) { return l !== "" || i === 1; });
      var url = links.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));
      status.hidden = false;
      status.innerHTML = "WhatsApp is opening with your request written out. <strong>It isn't sent until you press Send in WhatsApp</strong>, and your table is only confirmed once Climax replies. Nothing opened? <a href=\"" + esc(url) + "\" target=\"_blank\" rel=\"noopener\">Open WhatsApp</a> or call <a href=\"" + esc(links.tel) + "\">" + esc(facts.phone) + "</a>.";
      form.setAttribute("data-last-url", url);
      window.open(url, "_blank", "noopener");
    });
  }
})();
