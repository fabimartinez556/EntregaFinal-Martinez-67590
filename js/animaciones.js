// ==============================
// Toast de error reutilizable
// ==============================
const toastErrorElement = document.getElementById("toastError");
const toastError = toastErrorElement ? new bootstrap.Toast(toastErrorElement) : null;

function mostrarErrorToast(mensaje) {
  if (toastError) {
    document.getElementById("toastErrorMensaje").textContent = mensaje;
    toastError.show();
  }
}

// ==============================
// Utilidades generales
// ==============================
function actualizarBoton(boton, estado) {
  if (estado === "enviando") {
    boton.disabled = true;
    boton.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...`;
  } else {
    boton.disabled = false;
    boton.innerHTML = "Enviar";
  }
}

function quitarPreload() {
  requestAnimationFrame(() => {
    document.body.classList.remove("preload");
    document.body.classList.add("loaded");
  });
}

// ==============================
// Animaciones
// ==============================
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
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(
    ".animate-in, .animate-left, .animate-right, .animate-up, .animate-zoom"
  ).forEach((el) => observer.observe(el));
}

// ==============================
// Validaciones
// ==============================
function validarInput(input) {
  if (!input.checkValidity()) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }
}

// ==============================
// Formulario de Contacto
// ==============================
function inicializarFormularioContacto() {
  const form = document.getElementById("formularioContacto");
  if (!form) return;

  const mensaje = document.getElementById("mensaje");
  const contador = document.getElementById("mensajeContador");
  const toastElement = document.getElementById("toastEnvio");
  const toast = toastElement ? new bootstrap.Toast(toastElement) : null;
  const botonEnviar = form.querySelector('button[type="submit"]');
  const inputs = form.querySelectorAll("input, textarea");

  mensaje.addEventListener("input", () => {
    const longitud = mensaje.value.length;
    contador.textContent = `${longitud} / 500 caracteres`;

    if (longitud < 10 || longitud > 500) {
      contador.classList.add("text-danger");
      mensaje.classList.add("is-invalid");
      mensaje.classList.remove("is-valid");
    } else {
      contador.classList.remove("text-danger");
      mensaje.classList.remove("is-invalid");
      mensaje.classList.add("is-valid");
    }
  });

  inputs.forEach((input) => {
    input.addEventListener("blur", () => validarInput(input));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    form.classList.add("was-validated");
    mensaje.value = mensaje.value.trim();
    const mensajeValido = mensaje.value.length >= 10 && mensaje.value.length <= 500;

    if (!form.checkValidity() || !mensajeValido) {
      const primerError = form.querySelector(":invalid");
      if (primerError) primerError.focus();

      if (!mensajeValido) {
        mensaje.classList.add("is-invalid");
        mensaje.classList.remove("is-valid");
        mensaje.focus();
      }
      return;
    }

    actualizarBoton(botonEnviar, "enviando");

    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xldbvllv", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        form.reset();
        form.classList.remove("was-validated");
        contador.textContent = "0 / 500 caracteres";
        mensaje.classList.remove("is-valid", "is-invalid");
        if (toast) toast.show();
      } else {
        mostrarErrorToast("Error al enviar el mensaje. Por favor, intentá de nuevo.");
      }
    } catch (error) {
      mostrarErrorToast("Error de red. Intentalo más tarde.");
      console.error("Error:", error);
    } finally {
      actualizarBoton(botonEnviar, "normal");
    }
  });
}

// ==============================
// Formulario de Comentario
// ==============================
function manejarFormularioComentario() {
  const form = document.getElementById("comentarioForm");
  if (!form) return;

  const toastElement = document.getElementById("toastComentario");
  const toast = toastElement ? new bootstrap.Toast(toastElement) : null;
  const botonEnviar = form.querySelector('button[type="submit"]');
  const inputs = form.querySelectorAll("input, textarea");

  inputs.forEach((input) => {
    input.addEventListener("blur", () => validarInput(input));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      const primerError = form.querySelector(":invalid");
      if (primerError) primerError.focus();
      return;
    }

    actualizarBoton(botonEnviar, "enviando");

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        form.reset();
        form.classList.remove("was-validated");
        inputs.forEach((input) =>
          input.classList.remove("is-valid", "is-invalid")
        );
        if (toast) toast.show();
      } else {
        mostrarErrorToast("Error al enviar el comentario. Por favor, intentá de nuevo.");
      }
    } catch (error) {
      mostrarErrorToast("Error de red. Intentalo más tarde.");
      console.error("Error:", error);
    } finally {
      actualizarBoton(botonEnviar, "normal");
    }
  });
}

// ==============================
// Inicialización al cargar
// ==============================
window.addEventListener("load", () => {
  quitarPreload();
  iniciarCarrusel();
  animacionesConScroll();
  inicializarFormularioContacto();
  manejarFormularioComentario();
});
