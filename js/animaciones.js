window.addEventListener("load", () => {
  // Asegura que todo esté cargado antes de quitar preload
  requestAnimationFrame(() => {
    document.body.classList.remove("preload");
    document.body.classList.add("loaded");
  });

  // Carrusel (si existe en la página)
  const carouselElement = document.querySelector("#carousel");
  if (carouselElement) {
    const carousel = bootstrap.Carousel.getOrCreateInstance(carouselElement);
    carouselElement.querySelector(".carousel-inner")?.addEventListener("click", () => {
      carousel.next();
    });
  }

  // Intersection Observer para animaciones con scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(
    ".animate-in, .animate-left, .animate-right, .animate-up, .animate-zoom"
  ).forEach((el) => observer.observe(el));
});
