(function () {
  // ---------------------------------------------------------------
  // WHERE TRIAL SIGN-UPS GO
  // Paste a form endpoint below to receive sign-ups automatically,
  // e.g. a free Formspree form: "https://formspree.io/f/abcdwxyz".
  // While it's empty, the visitor's email app opens with their
  // details already filled in, addressed to CONTACT_EMAIL.
  // ---------------------------------------------------------------
  var FORM_ENDPOINT = "";
  var CONTACT_EMAIL = "hello@rankheron.com";


  // Trial sign-up forms
  document.querySelectorAll("[data-trial-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var button = form.querySelector('button[type="submit"]');
      var data = new FormData(form);
      if (data.get("_gotcha")) return; // spam bot

      if (FORM_ENDPOINT) {
        button.disabled = true;
        status.textContent = "Sending…";
        fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            form.reset();
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
