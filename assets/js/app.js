/* 星川ユウヤ 特別特典サイト — interactions */
(function () {
  "use strict";

  /* ---------- reading progress bar ---------- */
  var bar = document.getElementById("progressBar");
  function updateBar() {
    if (!bar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateBar, { passive: true });
  updateBar();

  /* ---------- mobile nav ---------- */
  var burger = document.querySelector(".nav-burger");
  var links = document.querySelector(".nav-links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      links.classList.toggle("open");
      document.body.classList.toggle("nav-open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- number counters ---------- */
  var cio = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        cio.unobserve(el);
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var start = null;
        var dur = 1400;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });

  /* ---------- toast ---------- */
  var toast = document.getElementById("toast");
  var toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.innerHTML = '<span class="check">✔</span>' + msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2400);
  }

  /* ---------- copy buttons ---------- */
  document.querySelectorAll("[data-copy-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-copy-target");
      var src = document.getElementById(id);
      if (!src) return;
      var text = src.textContent;
      function done() {
        btn.classList.add("copied");
        var prev = btn.innerHTML;
        btn.innerHTML = "✔ コピーしました";
        showToast("プロンプトをコピーしました");
        setTimeout(function () {
          btn.classList.remove("copied");
          btn.innerHTML = prev;
        }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });
  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------- collapsible code boxes ---------- */
  document.querySelectorAll(".codebox.collapsible").forEach(function (box) {
    var pre = box.querySelector("pre");
    var btn = box.querySelector(".expand-btn");
    if (!pre || !btn) return;
    // 中身が短い場合は畳まない
    if (pre.scrollHeight <= 470) {
      box.classList.add("expanded");
      btn.style.display = "none";
      var f = box.querySelector(".fade");
      if (f) f.style.display = "none";
      return;
    }
    btn.addEventListener("click", function () {
      var open = box.classList.toggle("expanded");
      btn.textContent = open ? "▲ 折りたたむ" : "▼ 全文を表示する";
      if (!open) box.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---------- back to top ---------- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 700);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
