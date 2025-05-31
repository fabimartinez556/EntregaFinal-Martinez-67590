function quitarPreload() {
  requestAnimationFrame(() => {
    document.body.classList.remove("preload");
    document.body.classList.add("loaded");
  });
}

function iniciarCarrusel() {
  const carouselElement = document.querySelector("#carousel");
  if (!carouselElement) return;

  const carousel = bootstrap.Carousel.getOrCreateInstance(carouselElement);
  const items = carouselElement.querySelectorAll(".carousel-item");
  if (items.length > 1) {
    carouselElement.querySelector(".carousel-inner")?.addEventListener("click", () => {
      carousel.next();
    });
  }
}

function animacionesConScroll() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    ".animate-in, .animate-left, .animate-right, .animate-up, .animate-zoom"
  ).forEach((el) => observer.observe(el));
}

window.addEventListener("load", () => {
  quitarPreload();
  iniciarCarrusel();
  animacionesConScroll();
});
