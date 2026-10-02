(function () {
  var menuBtn = document.getElementById("menuBtn");
  var mobileNav = document.getElementById("mobileNav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.hasAttribute("hidden");
      if (open) {
        mobileNav.removeAttribute("hidden");
        menuBtn.setAttribute("aria-expanded", "true");
        menuBtn.setAttribute("aria-label", "Close menu");
      } else {
        mobileNav.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open menu");
      }
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open menu");
      });
    });
  }

  var form = document.getElementById("enquiryForm");
  var status = document.getElementById("formStatus");
  var submitBtn = document.getElementById("submitBtn");

  if (form) {
    // Destination kept out of markup
    var dest = atob("YWthc2h0aGF0dGFucGFyYW1iaWxAZ21haWwuY29t");
    form.setAttribute("action", "https://formsubmit.co/" + dest);
  }

  function showStatus(kind, text) {
    if (!status) return;
    status.hidden = false;
    status.className = "form-status " + kind;
    status.textContent = text;
  }

  if (status && /(?:\?|&)sent=1(?:&|$)/.test(window.location.search)) {
    showStatus("ok", "Thank you. Your enquiry has been sent. I will reply to the work email you provided.");
  }

  if (form) {
    form.addEventListener("submit", function () {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
    });
  }
})();
