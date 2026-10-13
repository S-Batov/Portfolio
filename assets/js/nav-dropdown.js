(function () {
  "use strict";

  var link = document.querySelector("[data-projects-link]");
  if (!link) return;

  var li = link.closest("li");
  if (!li) return;

  var root = document.body.getAttribute("data-root") || ".";

  fetch(root + "/projects.html")
    .then(function (res) { return res.text(); })
    .then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var cards = doc.querySelectorAll(".projects-grid .project-card");
      if (!cards.length) return;

      var dropdown = document.createElement("div");
      dropdown.className = "nav__dropdown";

      cards.forEach(function (card) {
        var titleEl = card.querySelector(".project-card__title");
        var href = card.getAttribute("href");
        if (!titleEl || !href) return;

        var a = document.createElement("a");
        a.href = root + "/" + href;
        a.textContent = titleEl.textContent;
        dropdown.appendChild(a);
      });

      if (!dropdown.children.length) return;
      li.appendChild(dropdown);

      // Touch devices don't trigger :hover — tap to toggle instead.
      link.addEventListener("click", function (e) {
        if (!matchMedia("(hover: hover)").matches) {
          if (!li.classList.contains("is-open")) {
            e.preventDefault();
            li.classList.add("is-open");
            document.addEventListener("click", function closeOnOutsideClick(ev) {
              if (!li.contains(ev.target)) {
                li.classList.remove("is-open");
                document.removeEventListener("click", closeOnOutsideClick);
              }
            });
          }
        }
      });
    })
    .catch(function () {
      // Opened as a local file:// page, or offline — dropdown just doesn't appear;
      // the plain "Projects" link above still works.
    });
})();
