// Enquiry form: validation, then POST to the configured endpoint
// or, if there is none, open the visitor's email app with the answers.
(function () {
  var form = document.getElementById("enquiry");
  if (!form) return;
  var errors = document.getElementById("form-errors");
  var endpoint = form.getAttribute("data-endpoint");
  var email = form.getAttribute("data-email");

  var j = new URLSearchParams(location.search).get("journey");
  if (j && form.journey.querySelector('option[value="' + j + '"]')) form.journey.value = j;

  function validate() {
    var problems = [];
    [["name", "Enter your name"], ["email", "Enter a valid email address"], ["consent", "Tick the box to let us reply"]].forEach(function (f) {
      var el = form[f[0]];
      var bad = el.type === "checkbox" ? !el.checked : !el.value.trim() || (el.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
      el.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad) problems.push('<li><a href="#' + el.id + '">' + f[1] + "</a></li>");
    });
    errors.innerHTML = problems.length ? "<p><strong>Please fix the following:</strong></p><ul>" + problems.join("") + "</ul>" : "";
    if (problems.length) errors.focus();
    return !problems.length;
  }

  function body() {
    var d = new FormData(form), lines = [];
    var labels = { name: "Name", email: "Email", when: "When", length: "Length", travellers: "Travellers", journey: "Journey", drives: "Long drives", message: "Message" };
    Object.keys(labels).forEach(function (k) { if (d.get(k)) lines.push(labels[k] + ": " + d.get(k)); });
    var ints = d.getAll("interests");
    if (ints.length) lines.push("Interests: " + ints.join(", "));
    return lines.join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    if (!endpoint) {
      location.href = "mailto:" + email + "?subject=" + encodeURIComponent("Trip enquiry from " + form.name.value) + "&body=" + encodeURIComponent(body());
      document.getElementById("form-note").textContent = "Your email app should now open with your enquiry. If it doesn't, email us at " + email + ".";
      return;
    }
    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.outerHTML = '<div class="form-success" role="status" tabindex="-1" id="ok"><h2>Thank you</h2><p>We have your enquiry and will reply within two working days.</p></div>';
        document.getElementById("ok").focus();
      })
      .catch(function () {
        btn.disabled = false;
        errors.innerHTML = '<p>Sorry, that didn\'t send. Please try again or email <a href="mailto:' + email + '">' + email + "</a>.</p>";
        errors.focus();
      });
  });
})();
