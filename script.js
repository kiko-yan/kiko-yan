/* ============================================================
   Kiki · 严钟毓 — Homepage interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Language toggle (EN / 中文) ---------- */
  var STORE_KEY = "kiki-lang";
  var langToggle = document.getElementById("lang-toggle");

  function applyLang(lang) {
    var isZh = lang === "zh";
    document.body.classList.toggle("lang-zh", isZh);
    document.documentElement.lang = isZh ? "zh-CN" : "en";
    document.querySelectorAll("[data-en]").forEach(function (el) {
      var val = isZh ? el.getAttribute("data-zh") : el.getAttribute("data-en");
      if (val != null && el.getAttribute("data-zh") != null) {
        el.innerHTML = val;
      }
    });
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }

  var saved = "en";
  try { saved = localStorage.getItem(STORE_KEY) || "en"; } catch (e) {}
  applyLang(saved);

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var next = document.body.classList.contains("lang-zh") ? "en" : "zh";
      applyLang(next);
    });
  }

  /* ---------- Navbar scrolled state + active link ---------- */
  var navbar = document.getElementById("navbar");
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));

  function onScroll() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 30);
    var pos = window.scrollY + window.innerHeight * 0.32;
    var current = "";
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.getElementById("mobile-menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () { mobileMenu.classList.toggle("open"); });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mobileMenu.classList.remove("open"); });
    });
  }

  /* ---------- Nav pill glow follows cursor ---------- */
  var navPill = document.getElementById("nav-pill");
  var navGlow = document.getElementById("nav-pill-glow");
  if (navPill && navGlow) {
    navPill.addEventListener("mousemove", function (e) {
      var r = navPill.getBoundingClientRect();
      navGlow.style.setProperty("--glow-x", (e.clientX - r.left) + "px");
      navGlow.style.setProperty("--glow-y", (e.clientY - r.top) + "px");
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Hero fade on scroll ---------- */
  var heroLeft = document.getElementById("hero-left");
  var heroRight = document.getElementById("hero-right");
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    var op = Math.max(0, 1 - y / 480);
    if (heroLeft) { heroLeft.style.opacity = op; heroLeft.style.transform = "translateY(" + y * 0.12 + "px)"; }
    if (heroRight) { heroRight.style.opacity = op; heroRight.style.transform = "translateY(" + y * 0.18 + "px)"; }
  }, { passive: true });

  /* ---------- Hero ripple / floating dots canvas ---------- */
  var canvas = document.getElementById("ripple-canvas");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, dots = [];
    var COLORS = ["rgba(139,111,240,0.55)", "rgba(255,135,178,0.5)", "rgba(120,214,190,0.5)", "rgba(255,158,109,0.5)"];

    function resize() {
      var hero = document.getElementById("hero");
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeDots() {
      var count = Math.min(46, Math.floor(W / 26));
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 2.4 + 1,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          c: COLORS[i % COLORS.length],
          tw: Math.random() * Math.PI * 2
        });
      }
    }

    var mouse = { x: -999, y: -999 };
    canvas.parentElement.addEventListener("mousemove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener("mouseleave", function () { mouse.x = -999; mouse.y = -999; });

    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.tw += 0.03;
        // gentle drift
        d.x += d.vx; d.y += d.vy;
        // soft mouse repulsion
        var dx = d.x - mouse.x, dy = d.y - mouse.y;
        var dist2 = dx * dx + dy * dy;
        if (dist2 < 12000) {
          var f = (12000 - dist2) / 12000 * 0.9;
          d.x += dx / Math.sqrt(dist2 + 0.1) * f;
          d.y += dy / Math.sqrt(dist2 + 0.1) * f;
        }
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;

        var tw = 0.6 + Math.sin(d.tw) * 0.4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.c;
        ctx.globalAlpha = tw;
        ctx.fill();
      }
      // connect nearby dots
      ctx.globalAlpha = 1;
      for (var a = 0; a < dots.length; a++) {
        for (var b = a + 1; b < dots.length; b++) {
          var ddx = dots[a].x - dots[b].x, ddy = dots[a].y - dots[b].y;
          var dd = ddx * ddx + ddy * ddy;
          if (dd < 9000) {
            ctx.beginPath();
            ctx.moveTo(dots[a].x, dots[a].y);
            ctx.lineTo(dots[b].x, dots[b].y);
            ctx.strokeStyle = "rgba(139,111,240," + (0.12 * (1 - dd / 9000)) + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }

    resize(); makeDots(); tick();
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { resize(); makeDots(); }, 200);
    });
  }
})();
