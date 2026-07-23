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

  /* ---------- Hero knowledge-graph network sphere ---------- */
  var canvas = document.getElementById("ripple-canvas");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;
    var nodes = [], ambient = [];
    var N = 96;
    var rotY = 0, rotX = -0.28, targetX = -0.28;
    var mouse = { x: 0, y: 0, active: false };

    function resize() {
      var hero = document.getElementById("hero");
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function build() {
      // Fibonacci-sphere node distribution (even spread)
      nodes = [];
      var gold = Math.PI * (3 - Math.sqrt(5));
      for (var i = 0; i < N; i++) {
        var y = 1 - (i / (N - 1)) * 2;
        var rr = Math.sqrt(1 - y * y);
        var th = gold * i;
        nodes.push({ x: Math.cos(th) * rr, y: y, z: Math.sin(th) * rr });
      }
      // ambient drifting particles
      ambient = [];
      var ac = Math.min(70, Math.floor(W / 20));
      for (var k = 0; k < ac; k++) {
        ambient.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.6 + 0.5,
          vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
          tw: Math.random() * Math.PI * 2
        });
      }
    }

    canvas.parentElement.addEventListener("mousemove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / W - 0.5;
      mouse.y = (e.clientY - r.top) / H - 0.5;
      mouse.active = true;
    });
    canvas.parentElement.addEventListener("mouseleave", function () { mouse.active = false; });

    function tick() {
      ctx.clearRect(0, 0, W, H);

      // ambient particles
      for (var a = 0; a < ambient.length; a++) {
        var p = ambient[a];
        p.x += p.vx; p.y += p.vy; p.tw += 0.02;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(130,160,225," + (0.14 + Math.sin(p.tw) * 0.1) + ")";
        ctx.fill();
      }

      // rotation (auto-spin + gentle mouse parallax)
      rotY += 0.0018;
      targetX = mouse.active ? (-0.28 + mouse.y * 0.5) : -0.28;
      rotX += (targetX - rotX) * 0.05;
      var yaw = mouse.active ? mouse.x * 0.6 : 0;

      var cx = W > 900 ? W * 0.72 : W * 0.5;
      var cy = W > 900 ? H * 0.48 : H * 0.42;
      var R = Math.min(W, H) * (W > 900 ? 0.26 : 0.3);

      var cosY = Math.cos(rotY + yaw), sinY = Math.sin(rotY + yaw);
      var cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      var pts = [];
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var x1 = n.x * cosY - n.z * sinY;
        var z1 = n.x * sinY + n.z * cosY;
        var y1 = n.y * cosX - z1 * sinX;
        var z2 = n.y * sinX + z1 * cosX;
        var persp = 1 / (1.9 - z2 * 0.55);
        pts.push({ sx: cx + x1 * R * persp, sy: cy + y1 * R * persp, depth: (z2 + 1) / 2 });
      }

      // edges between nearby nodes (3D proximity)
      for (var i2 = 0; i2 < nodes.length; i2++) {
        for (var j = i2 + 1; j < nodes.length; j++) {
          var dx = nodes[i2].x - nodes[j].x, dy = nodes[i2].y - nodes[j].y, dz = nodes[i2].z - nodes[j].z;
          var d = dx * dx + dy * dy + dz * dz;
          if (d < 0.26) {
            var depth = (pts[i2].depth + pts[j].depth) * 0.5;
            var alpha = (1 - d / 0.26) * (0.10 + depth * 0.32);
            if (alpha > 0.015) {
              ctx.beginPath();
              ctx.moveTo(pts[i2].sx, pts[i2].sy);
              ctx.lineTo(pts[j].sx, pts[j].sy);
              ctx.strokeStyle = "rgba(91,140,255," + alpha.toFixed(3) + ")";
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }
      }

      // nodes (front nodes glow brighter)
      for (var k2 = 0; k2 < pts.length; k2++) {
        var pt = pts[k2];
        var rad = 1.2 + pt.depth * 2.4;
        var cyan = k2 % 3 === 0;
        if (pt.depth > 0.62) {
          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, rad * 3, 0, Math.PI * 2);
          ctx.fillStyle = cyan ? "rgba(52,214,224,0.07)" : "rgba(91,140,255,0.07)";
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, rad, 0, Math.PI * 2);
        ctx.fillStyle = cyan
          ? "rgba(72,222,232," + (0.35 + pt.depth * 0.55) + ")"
          : "rgba(130,170,255," + (0.35 + pt.depth * 0.55) + ")";
        ctx.fill();
      }

      requestAnimationFrame(tick);
    }

    resize(); build(); tick();
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { resize(); build(); }, 200);
    });
  }
})();
