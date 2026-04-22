
// Carrusel de galería en móvil

const MOBILE_BREAKPOINT = 768;
const GALERIA_INTERVAL_MS = 4000;

const contenedorGaleria = document.getElementById("imagenes-galeria");
const tarjetasGaleria = contenedorGaleria
    ? Array.from(contenedorGaleria.querySelectorAll(".categoria-galeria"))
    : [];

let indiceGaleria = 0;
let intervaloGaleria = null;
let contenedorDots = null;

function crearDots() {
    contenedorDots = document.createElement("div");
    contenedorDots.className = "galeria-dots";

    tarjetasGaleria.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "galeria-dot";
        dot.setAttribute("aria-label", `Ir a la imagen ${i + 1}`);
        dot.addEventListener("click", () => {
            mostrarTarjeta(i);
            reiniciarAutoAvance();
        });
        contenedorDots.appendChild(dot);
    });

    contenedorGaleria.insertAdjacentElement("afterend", contenedorDots);
}

function mostrarTarjeta(i) {
    indiceGaleria = i;
    tarjetasGaleria.forEach((t, idx) => {
        t.classList.toggle("is-active", idx === i);
    });
    if (contenedorDots) {
        contenedorDots.querySelectorAll(".galeria-dot").forEach((d, idx) => {
            d.classList.toggle("is-active", idx === i);
        });
    }
}

function siguienteTarjeta() {
    mostrarTarjeta((indiceGaleria + 1) % tarjetasGaleria.length);
}

function iniciarAutoAvance() {
    detenerAutoAvance();
    intervaloGaleria = setInterval(siguienteTarjeta, GALERIA_INTERVAL_MS);
}

function detenerAutoAvance() {
    if (intervaloGaleria) {
        clearInterval(intervaloGaleria);
        intervaloGaleria = null;
    }
}

function reiniciarAutoAvance() {
    if (intervaloGaleria) iniciarAutoAvance();
}

function activarCarruselMovil() {
    if (!contenedorDots) crearDots();
    mostrarTarjeta(0);
    iniciarAutoAvance();
}

function desactivarCarruselMovil() {
    detenerAutoAvance();
    tarjetasGaleria.forEach(t => t.classList.remove("is-active"));
    if (contenedorDots) {
        contenedorDots.remove();
        contenedorDots = null;
    }
}

function sincronizarGaleriaConViewport() {
    if (tarjetasGaleria.length === 0) return;
    const esMovil = window.innerWidth <= MOBILE_BREAKPOINT;
    const carruselActivo = intervaloGaleria !== null || contenedorDots !== null;

    if (esMovil && !carruselActivo) {
        activarCarruselMovil();
    } else if (!esMovil && carruselActivo) {
        desactivarCarruselMovil();
    }
}

sincronizarGaleriaConViewport();
window.addEventListener("resize", sincronizarGaleriaConViewport);


// Validación del formulario

const formulario = document.getElementById("form-pedido");
const nombre = document.getElementById("nombre");
const telefono = document.getElementById("telefono");
const correo = document.getElementById("correo");
const checkbox = document.getElementById("checkbox");

formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    let bNombreValido = true;
    if (!nombre.value.trim()) {
        alert("El nombre no puede estar vacío");
        bNombreValido = false;
    }

    let bTelefonoValido = true;
    const regexTel = /^(\+34\s?)?[6789]\d{8}$/;
    if (!telefono.value.trim() || !regexTel.test(telefono.value.trim())) {
        alert("Teléfono no válido (formato: 612345678 o +34 612345678)");
        bTelefonoValido = false;
    }

    let bCorreoValido = true;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo.value.trim() || !regexEmail.test(correo.value.trim())) {
        alert("Correo electrónico no válido");
        bCorreoValido = false;
    }

    let bCheckboxValido = checkbox.checked;
    if (!bCheckboxValido) {
        alert("Debes aceptar la política de privacidad");
    }

    if (!bNombreValido || !bTelefonoValido || !bCorreoValido || !bCheckboxValido) {
        return;
    }

    console.log("Formulario válido — listo para enviar");
});
