(function () {
  // Active page is marked in HTML via aria-current.
  // Soft fade-in for cards when supported.
  if (!("IntersectionObserver" in window)) return;
  var nodes = document.querySelectorAll(".card, .job, .award-card, .stat, .timeline li");
  if (!nodes.length) return;
  nodes.forEach(function (el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.style.transition = "opacity 0.45s ease, transform 0.45s ease";
  });
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.style.transform = "none";
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  nodes.forEach(function (el) { io.observe(el); });
})();
