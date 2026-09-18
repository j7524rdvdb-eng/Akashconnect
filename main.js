(function () {
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  var form = document.getElementById("employer-form");
  var status = document.getElementById("form-status");
  if (form) {
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
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }
    });
  }
})();
