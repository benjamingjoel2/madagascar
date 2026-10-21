// Shared behaviour: header state, mobile menu, reveal-on-scroll.
(function () {
  var hdr = document.getElementById("hdr");
  var btn = hdr.querySelector(".menu-btn");
  var nav = document.getElementById("main-nav");

  // Header turns solid once the page scrolls.
  function onScroll() { hdr.classList.toggle("is-solid", window.scrollY > 24); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu (without JS the nav simply wraps under the logo).
  btn.hidden = false;
  function setOpen(open) {
    btn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  }
  btn.addEventListener("click", function () { setOpen(btn.getAttribute("aria-expanded") !== "true"); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); btn.focus(); }
  });

  // Fade sections in as they scroll into view (skipped with reduced motion).
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }
  document.documentElement.classList.add("reveal-ready");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  els.forEach(function (el) { io.observe(el); });
})();
