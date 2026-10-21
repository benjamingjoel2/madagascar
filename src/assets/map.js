// Route planner for the driving-time map: fastest road route vs. flying.
(function () {
  var form = document.getElementById("planner");
  if (!form) return;
  var graph = JSON.parse(form.getAttribute("data-graph"));
  var out = document.getElementById("planner-out");
  var legEls = document.querySelectorAll(".map-svg .leg");
  var FLIGHT_OVERHEAD = 3; // check-in, transfers and waiting, in hours
  var DRIVE_DAY = 7; // hours we plan as a full road day

  function fmt(h) {
    var w = Math.floor(h), f = Math.round((h - w) * 4) / 4;
    var s = { 0: "", 0.25: "¼", 0.5: "½", 0.75: "¾" }[f];
    if (f === 1) { w += 1; s = ""; }
    return (w === 0 && s ? "" : w) + s;
  }
  function range(a, b) { return Math.abs(a - b) < 0.01 ? fmt(a) + " h" : fmt(a) + "–" + fmt(b) + " h"; }

  // Dijkstra over legs (both directions). Returns {stops, legIdx, min, max} or null.
  function route(from, to, allowFlights, dry) {
    var dist = {}, prev = {}, done = {}, keys = Object.keys(graph.places);
    keys.forEach(function (k) { dist[k] = Infinity; });
    dist[from] = 0;
    while (true) {
      var u = null;
      keys.forEach(function (k) { if (!done[k] && dist[k] < Infinity && (u === null || dist[k] < dist[u])) u = k; });
      if (u === null || u === to) break;
      done[u] = true;
      graph.legs.forEach(function (l, i) {
        if (l.mode === "flight" && !allowFlights) return;
        if (l.season === "dry" && !dry) return;
        var v = l.from === u ? l.to : l.to === u ? l.from : null;
        if (!v || done[v]) return;
        var w = (l.hours[0] + l.hours[1]) / 2 + (l.mode === "flight" ? FLIGHT_OVERHEAD : 0);
        if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; prev[v] = { node: u, leg: i }; }
      });
    }
    if (dist[to] === Infinity) return null;
    var stops = [to], legIdx = [], min = 0, max = 0, flights = 0, n = to;
    while (n !== from) {
      var p = prev[n], l = graph.legs[p.leg];
      legIdx.unshift(p.leg);
      if (l.mode === "flight") { flights++; min += l.hours[0] + FLIGHT_OVERHEAD; max += l.hours[1] + FLIGHT_OVERHEAD; }
      else { min += l.hours[0]; max += l.hours[1]; }
      n = p.node; stops.unshift(n);
    }
    return { stops: stops, legIdx: legIdx, min: min, max: max, flights: flights };
  }

  function names(r) { return r.stops.map(function (k) { return graph.places[k].name; }).join(" → "); }

  function highlight(idx) {
    if (!touched) idx = [];
    legEls.forEach(function (el) {
      var i = +el.getAttribute("data-leg");
      el.classList.toggle("is-hl", idx.indexOf(i) > -1);
      el.classList.toggle("is-dim", idx.length > 0 && idx.indexOf(i) === -1);
    });
  }

  function update() {
    var from = form.from.value, to = form.to.value, dry = form.dry.checked;
    if (from === to) { out.innerHTML = "<p>Choose two different places.</p>"; highlight([]); return; }
    var road = route(from, to, false, dry);
    var any = route(from, to, true, dry);
    var html = "";
    if (road) {
      var days = Math.ceil(road.max / DRIVE_DAY);
      html += '<div class="route"><h3>By road</h3><p class="big">' + range(road.min, road.max) + "</p><p>" + names(road) +
        "</p><p>About " + days + " day" + (days > 1 ? "s" : "") + " of driving at up to " + DRIVE_DAY + " hours a day.</p></div>";
    } else {
      html += '<div class="route"><h3>By road</h3><p>No practical road route' + (!dry ? " in the wet season" : "") + ". " +
        (!dry ? "The Tsingy track is usually impassable in the rains." : "") + "</p></div>";
    }
    if (any && any.flights > 0) {
      html += '<div class="route route--fly"><h3>Using a domestic flight</h3><p class="big">' + range(any.min, any.max) +
        "</p><p>" + names(any) + "</p><p>Includes about " + FLIGHT_OVERHEAD + " hours per flight for check-in and transfers.</p></div>";
      if (road) {
        var saved = (road.min + road.max) / 2 - (any.min + any.max) / 2;
        if (saved >= 6) html += '<p class="saves"><strong>Flying saves about ' + fmt(Math.round(saved)) + " hours</strong>, which is roughly " +
          (saved >= DRIVE_DAY * 1.5 ? Math.round(saved / DRIVE_DAY) + " days" : "a day") + " on the road.</p>";
      }
    }
    if (!road && !any) html = "<p>No route between these places in the season you chose.</p>";
    out.innerHTML = html;
    highlight((road && !(any && any.flights)) ? road.legIdx : (any ? any.legIdx.concat(road ? road.legIdx : []) : []));
  }

  var touched = false; // show the whole map until someone picks a route
  form.addEventListener("change", function () { touched = true; update(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); touched = true; update(); });
  update();

  // Hover or focus a table row to highlight that leg on the map.
  document.querySelectorAll(".legs-table tbody tr").forEach(function (tr) {
    var i = +tr.getAttribute("data-leg");
    function on() { highlight([i]); tr.classList.add("is-hl"); }
    function off() { tr.classList.remove("is-hl"); update(); }
    tr.addEventListener("mouseenter", on);
    tr.addEventListener("mouseleave", off);
  });
})();
