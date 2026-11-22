(function () {
  // ---------------------------------------------------------------
  // WHERE TRIAL SIGN-UPS GO
  // Paste a form endpoint below to receive sign-ups automatically,
  // e.g. a free Formspree form: "https://formspree.io/f/abcdwxyz".
  // While it's empty, the visitor's email app opens with their
  // details already filled in, addressed to CONTACT_EMAIL.
  // ---------------------------------------------------------------
  var FORM_ENDPOINT = "";
  var CONTACT_EMAIL = "hi@rankheron.com";

  // Trial sign-up forms: step 1 asks for the website only,
  // step 2 reveals the competitor and email fields.
  document.querySelectorAll("[data-trial-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');
    var label = form.querySelector(".btn-label");
    var finalLabel = label ? label.textContent : "";
    var step2Inputs = form.querySelectorAll(".step-2 input");

    function showStep(first) {
      form.classList.toggle("is-step-1", first);
      step2Inputs.forEach(function (input) { input.disabled = first; });
      if (label) label.textContent = first ? "Get started" : finalLabel;
    }
    if (step2Inputs.length) showStep(true);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.classList.contains("is-step-1")) {
        showStep(false);
        step2Inputs[0].focus();
        return;
      }
      var data = new FormData(form);
      if (data.get("_gotcha")) return; // spam bot

      if (FORM_ENDPOINT) {
        button.disabled = true;
        status.textContent = "Sending…";
        fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            form.reset();
            showStep(true);
            status.textContent = "You're in! Your 14-day free trial has started. Look out for your competitor audit within 48 hours.";
          })
          .catch(function () {
            status.textContent = "Sorry, that didn't send. Please email " + CONTACT_EMAIL + " and we'll get you started.";
          })
          .then(function () {
            button.disabled = false;
          });
      } else {
        var body =
          "Please start my 14-day free trial.\n\n" +
          "Website: " + data.get("website") + "\n" +
          "Competitor: " + data.get("competitor") + "\n" +
          "Email: " + data.get("email") + "\n";
        window.location.href =
          "mailto:" + CONTACT_EMAIL +
          "?subject=" + encodeURIComponent("14-day free trial") +
          "&body=" + encodeURIComponent(body);
        status.textContent = "Your email app should open with your details filled in. Press send and we'll get started.";
      }
    });
  });
})();
