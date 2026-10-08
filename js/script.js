/* ==========================================================================
   Erick Ochieng Opiyo — Portfolio scripts
   - Mobile navigation (hamburger ⇄ X, outside click, Esc, link click)
   - Sticky header shadow
   - Scroll reveal + timeline draw
   - Project filtering
   - Contact form validation
   - Placeholder-link toast
   - Footer year
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Toast ---------- */
  var toastEl, toastTimer;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    // force reflow so the transition replays
    void toastEl.offsetWidth;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  /* ---------- Mobile navigation ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  var backdrop = document.querySelector(".nav-backdrop");
  var mobileQuery = window.matchMedia("(max-width: 900px)");

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    menu.classList.toggle("open", open);
    if (backdrop) backdrop.classList.toggle("show", open);
    // Hide menu items from keyboard/screen readers when collapsed on mobile
    if (mobileQuery.matches) {
      if (open) menu.removeAttribute("inert"); else menu.setAttribute("inert", "");
    }
    if (open) {
      var first = menu.querySelector("a");
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60);
    }
  }
  function isOpen() { return toggle && toggle.getAttribute("aria-expanded") === "true"; }

  function syncMenuToViewport() {
    if (!menu) return;
    if (mobileQuery.matches) {
      if (!isOpen()) menu.setAttribute("inert", "");
    } else {
      menu.removeAttribute("inert");
      setMenu(false);
    }
  }

  if (toggle && menu) {
    syncMenuToViewport();
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!isOpen());
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("click", function (e) {
      if (isOpen() && !menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) { setMenu(false); toggle.focus(); }
    });
    if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", syncMenuToViewport);
    else if (mobileQuery.addListener) mobileQuery.addListener(syncMenuToViewport);
  }

  /* ---------- Header shadow on scroll ---------- */
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Timeline line draws in ---------- */
  var timeline = document.querySelector(".timeline");
  if (timeline && !reduceMotion && "IntersectionObserver" in window) {
    timeline.style.setProperty("--line", "0");
    var tio = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        timeline.style.setProperty("--line", "1");
        tio.disconnect();
      }
    }, { threshold: 0.2 });
    tio.observe(timeline);
  }

  /* ---------- Project filtering ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var projects = document.querySelectorAll("[data-category]");
  var emptyMsg = document.querySelector(".filter-empty");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      var visible = 0;

      projects.forEach(function (card) {
        var match = filter === "all" || card.getAttribute("data-category").split(" ").indexOf(filter) !== -1;
        if (match) visible++;
        if (reduceMotion) {
          card.classList.toggle("is-hidden", !match);
          return;
        }
        if (match) {
          card.classList.remove("is-hidden");
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { card.classList.remove("is-hiding"); });
          });
        } else {
          card.classList.add("is-hiding");
          setTimeout(function () {
            if (card.classList.contains("is-hiding")) card.classList.add("is-hidden");
          }, 320);
        }
      });

      if (emptyMsg) emptyMsg.style.display = visible ? "none" : "block";
      var live = document.getElementById("filter-status");
      if (live) live.textContent = "Showing " + visible + " project" + (visible === 1 ? "" : "s");
    });
  });

  /* ---------- Placeholder links ([PROJECT URL] etc.) ---------- */
  document.addEventListener("click", function (e) {
    var link = e.target.closest("[data-placeholder]");
    if (!link) return;
    e.preventDefault();
    toast(link.getAttribute("data-placeholder") || "This link will be added soon.");
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var rules = {
      name: function (v) { return v.trim().length >= 2 ? "" : "Please enter your name (at least 2 characters)."; },
      email: function (v) { return emailRe.test(v.trim()) ? "" : "Please enter a valid email address."; },
      subject: function (v) { return v.trim().length >= 3 ? "" : "Please add a short subject."; },
      message: function (v) { return v.trim().length >= 10 ? "" : "Your message should be at least 10 characters."; }
    };

    function validateField(input) {
      var rule = rules[input.name];
      if (!rule) return true;
      var msg = rule(input.value);
      var field = input.closest(".field");
      var err = field.querySelector(".field-error");
      field.classList.toggle("invalid", !!msg);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) err.textContent = msg;
      return !msg;
    }

    function showStatus(type, text) {
      status.className = "form-status show " + type;
      status.textContent = text;
    }

    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      input.addEventListener("blur", function () { if (input.value) validateField(input); });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("invalid")) validateField(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstInvalid = null;
      Object.keys(rules).forEach(function (name) {
        var input = form.elements[name];
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        showStatus("error", "Please fix the highlighted fields and try again.");
        firstInvalid.focus();
        return;
      }
      // Honeypot: silently drop bot submissions
      if (form.elements.website && form.elements.website.value) return;

      var endpoint = form.getAttribute("data-endpoint");
      if (!endpoint) {
        // No backend configured yet (see README → "Connect the contact form")
        showStatus("info", "Thanks, " + form.elements.name.value.trim().split(" ")[0] +
          "! The form is not connected to a mail service yet, so please reach me by email or WhatsApp for now.");
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = "Sending…";

      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      }).then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        showStatus("success", "Message sent! I'll get back to you as soon as I can.");
      }).catch(function () {
        showStatus("error", "Sorry, something went wrong. Please try again or contact me directly by email.");
      }).finally(function () {
        btn.disabled = false;
        btn.innerHTML = label;
      });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
