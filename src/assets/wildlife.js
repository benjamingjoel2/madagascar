// Filters for the wildlife guide: park, month and lemurs-only.
(function () {
  var form = document.getElementById("wl-filters");
  if (!form) return;
  var summary = document.getElementById("wl-summary");
  var T = JSON.parse(form.getAttribute("data-i18n"));
  var MONTHS = T.months;
  function fill(s, v) { return s.replace(/\{(\w+)\}/g, function (m, k) { return k in v ? v[k] : m; }); }
  var parks = document.querySelectorAll(".park");

  // Pre-select from URL, e.g. /wildlife/?month=2
  var q = new URLSearchParams(location.search);
  ["park", "month", "type"].forEach(function (k) { if (q.has(k)) form[k].value = q.get(k); });

  function update() {
    var park = form.park.value, month = form.month.value, type = form.type.value;
    var closed = [], difficult = [], good = [];
    parks.forEach(function (p) {
      p.hidden = park !== "" && p.getAttribute("data-park") !== park;
      p.querySelectorAll("tbody tr[data-type]").forEach(function (tr) {
        var t = tr.getAttribute("data-type");
        tr.hidden = type === "lemur" ? t !== "lemur" : type === "other" ? t === "lemur" : false;
      });
      p.querySelectorAll("[data-month]").forEach(function (c) {
        c.classList.toggle("is-month", month !== "" && c.getAttribute("data-month") === month);
      });
      if (month === "" || p.hidden) return;
      var name = p.querySelector("h3").textContent;
      var acc = p.querySelector('.access-row [data-month="' + month + '"]');
      if (acc.classList.contains("cell--closed")) closed.push(name);
      else if (acc.classList.contains("cell--difficult")) difficult.push(name);
      p.querySelectorAll("tbody tr[data-type]").forEach(function (tr) {
        if (tr.hidden) return;
        if (tr.querySelector('[data-month="' + month + '"]').classList.contains("cell--good") && !acc.classList.contains("cell--closed"))
          good.push(tr.querySelector(".sp-name").textContent + " (" + p.getAttribute("data-short") + ")");
      });
    });
    if (month === "") { summary.innerHTML = ""; return; }
    var html = "<strong>" + fill(T.inMonth, { month: MONTHS[month] }) + "</strong><ul>";
    if (closed.length) html += "<li>" + fill(T.closed, { list: closed.join(", ") }) + "</li>";
    if (difficult.length) html += "<li>" + fill(T.hard, { list: difficult.join(", ") }) + "</li>";
    html += "<li>" + (good.length ? fill(T.good, { list: good.join(", ") }) : T.none) + "</li></ul>";
    summary.innerHTML = html;
  }
  form.addEventListener("change", update);
  update();
})();
