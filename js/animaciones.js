// ==============================
// Toast de error reutilizable
// ==============================
const toastErrorElement = document.getElementById("toastError");
const toastError = toastErrorElement ? new bootstrap.Toast(toastErrorElement) : null;
const toastErrorMensaje = document.getElementById("toastErrorMensaje");

function mostrarErrorToast(mensaje) {
  if (toastError) {
    toastErrorMensaje.textContent = mensaje;
    toastError.show();
  }
}

// ==============================
// Utilidades generales
// ==============================
function actualizarBoton(boton, estado) {
  if (estado === "enviando") {
    boton.disabled = true;
    boton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...`;
  } else {
    boton.disabled = false;
    boton.textContent = "Enviar";
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

function agregarValidacionInputs(inputs) {
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validarInput(input));
  });
}

// ==============================
// Función genérica para enviar formulario
// ==============================
async function enviarFormulario(form, toast, botonEnviar) {
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
      form.querySelectorAll("input, textarea").forEach((input) => {
        input.classList.remove("is-valid", "is-invalid");
      });
      if (toast) toast.show();
      return true;
    } else {
      mostrarErrorToast("Error al enviar el formulario. Por favor, intentá de nuevo.");
      return false;
    }
  } catch (error) {
    mostrarErrorToast("Error de red. Intentalo más tarde.");
    console.error("Error:", error);
    return false;
  } finally {
    actualizarBoton(botonEnviar, "normal");
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

  function validarMensaje() {
    const length = mensaje.value.trim().length;
    return length >= 10 && length <= 500;
  }

  mensaje.addEventListener("input", () => {
    const longitud = mensaje.value.length;
    contador.textContent = `${longitud} / 500 caracteres`;

    if (!validarMensaje()) {
      contador.classList.add("text-danger");
      mensaje.classList.add("is-invalid");
      mensaje.classList.remove("is-valid");
    } else {
      contador.classList.remove("text-danger");
      mensaje.classList.remove("is-invalid");
      mensaje.classList.add("is-valid");
    }
  });

  agregarValidacionInputs(inputs);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    form.classList.add("was-validated");
    mensaje.value = mensaje.value.trim();

    if (!form.checkValidity() || !validarMensaje()) {
      const primerError = form.querySelector(":invalid");
      if (primerError) primerError.focus();

      if (!validarMensaje()) {
        mensaje.classList.add("is-invalid");
        mensaje.classList.remove("is-valid");
        mensaje.focus();
      }
      return;
    }

    // Definimos action aquí para que coincida con fetch genérico
    if (!form.action || form.action === window.location.href) {
  form.action = "https://formspree.io/f/xldbvllv";
}

    await enviarFormulario(form, toast, botonEnviar);

    // Actualizamos contador después de reset
    contador.textContent = "0 / 500 caracteres";
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

  agregarValidacionInputs(inputs);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      const primerError = form.querySelector(":invalid");
      if (primerError) primerError.focus();
      return;
    }

    await enviarFormulario(form, toast, botonEnviar);
  });
}

// ==============================
// Inicialización al cargar
// ==============================
window.addEventListener("DOMContentLoaded", () => {
  quitarPreload();
  iniciarCarrusel();
  animacionesConScroll();
  inicializarFormularioContacto();
  manejarFormularioComentario();
});
