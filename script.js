
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

if (formulario) {

const nombre = document.getElementById("nombre");
const telefono = document.getElementById("telefono");
const correo = document.getElementById("correo");
// Checkbox de política de privacidad desactivado temporalmente (pendiente aviso legal definitivo)
// const checkbox = document.getElementById("checkbox");

const REGEX_TELEFONO = /^(\+34\s?)?[6789]\d{8}$/;
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mostrarError(campo, mensaje) {
    const contenedor = campo.closest(".campo-formulario");
    contenedor.classList.add("tiene-error");
    campo.setAttribute("aria-invalid", "true");

    let errorEl = contenedor.querySelector(".mensaje-error");
    if (!errorEl) {
        errorEl = document.createElement("span");
        errorEl.className = "mensaje-error";
        errorEl.setAttribute("role", "alert");
        contenedor.appendChild(errorEl);
    }
    errorEl.textContent = mensaje;
}

function limpiarError(campo) {
    const contenedor = campo.closest(".campo-formulario");
    contenedor.classList.remove("tiene-error");
    campo.removeAttribute("aria-invalid");
    const errorEl = contenedor.querySelector(".mensaje-error");
    if (errorEl) errorEl.remove();
}

function validarNombre() {
    if (!nombre.value.trim()) {
        mostrarError(nombre, "Introduce tu nombre");
        return false;
    }
    limpiarError(nombre);
    return true;
}

function validarContacto() {
    const telValor = telefono.value.trim();
    const mailValor = correo.value.trim();

    // Si ambos están vacíos, marcamos los dos: hace falta al menos uno
    if (!telValor && !mailValor) {
        mostrarError(telefono, "Introduce un teléfono o un correo");
        mostrarError(correo, "Introduce un teléfono o un correo");
        return false;
    }

    let esValido = true;

    // Teléfono: si tiene valor, debe ser válido; si está vacío, se permite
    if (telValor) {
        if (!REGEX_TELEFONO.test(telValor)) {
            mostrarError(telefono, "Formato no válido (ej: 612345678 o +34 612345678)");
            esValido = false;
        } else {
            limpiarError(telefono);
        }
    } else {
        limpiarError(telefono);
    }

    // Correo: si tiene valor, debe ser válido; si está vacío, se permite
    if (mailValor) {
        if (!REGEX_CORREO.test(mailValor)) {
            mostrarError(correo, "Correo electrónico no válido");
            esValido = false;
        } else {
            limpiarError(correo);
        }
    } else {
        limpiarError(correo);
    }

    return esValido;
}

// Validación del checkbox desactivada temporalmente (pendiente aviso legal definitivo)
// function validarCheckbox() {
//     if (!checkbox.checked) {
//         mostrarError(checkbox, "Debes aceptar la política de privacidad");
//         return false;
//     }
//     limpiarError(checkbox);
//     return true;
// }

formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const resultados = [
        validarNombre(),
        validarContacto(),
    ];

    const esValido = resultados.every(Boolean);
    if (!esValido) {
        const primerError = formulario.querySelector(".campo-formulario.tiene-error");
        if (primerError) primerError.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    const boton = formulario.querySelector("button[type='submit']");
    boton.disabled = true;
    boton.textContent = "Enviando...";

    const mensaje = document.getElementById("texto-largo");

    emailjs.send("service_knp3qxw", "template_a06evy8", {
        nombre: nombre.value.trim(),
        telefono: telefono.value.trim() || "No indicado",
        correo: correo.value.trim() || "No indicado",
        mensaje: mensaje.value.trim() || "Sin mensaje",
    })
    .then(() => {
        boton.textContent = "¡Enviado!";
        formulario.reset();
        setTimeout(() => {
            boton.disabled = false;
            boton.textContent = "Enviar";
        }, 4000);
    })
    .catch(() => {
        boton.disabled = false;
        boton.textContent = "Enviar";
        alert("Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.");
    });
});

// Limpiar el error de un campo en cuanto el usuario lo corrige
nombre.addEventListener("input", () => {
    if (nombre.value.trim()) limpiarError(nombre);
});

function limpiarErroresContactoSiProcede() {
    const telValor = telefono.value.trim();
    const mailValor = correo.value.trim();

    // Teléfono: limpia si tiene formato válido o si está vacío pero hay correo
    if ((telValor && REGEX_TELEFONO.test(telValor)) || (!telValor && mailValor)) {
        limpiarError(telefono);
    }

    // Correo: limpia si tiene formato válido o si está vacío pero hay teléfono
    if ((mailValor && REGEX_CORREO.test(mailValor)) || (!mailValor && telValor)) {
        limpiarError(correo);
    }
}

telefono.addEventListener("input", limpiarErroresContactoSiProcede);
correo.addEventListener("input", limpiarErroresContactoSiProcede);

// Listener del checkbox desactivado temporalmente (pendiente aviso legal definitivo)
// checkbox.addEventListener("change", () => {
//     if (checkbox.checked) limpiarError(checkbox);
// });

} // fin if (formulario)


// Diálogo visor de imágenes (galeria.html)

const lightbox = document.getElementById("lightbox");

if (lightbox && typeof lightbox.showModal === "function") {
    const lightboxImg = lightbox.querySelector(".lightbox-img");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const btnClose = lightbox.querySelector(".lightbox-close");
    const btnPrev = lightbox.querySelector(".lightbox-prev");
    const btnNext = lightbox.querySelector(".lightbox-next");

    const figura = lightbox.querySelector(".lightbox-figura");
    const items = Array.from(document.querySelectorAll(".grid-catalogo-item img"));
    const DURACION_CAMBIO = 220; // debe coincidir con la transición CSS
    let indiceActual = 0;
    let animando = false;

    function actualizarImagen() {
        const img = items[indiceActual];
        // Usar siempre la variante a máxima resolución (sin sufijo -800w/-400w)
        const fullSrc = img.src.replace(/-(?:400|800)w\.(jpeg|jpg|webp)$/i, '.$1');
        lightboxImg.src = fullSrc;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.alt;
    }

    function abrirLightbox(i) {
        indiceActual = i;
        actualizarImagen();
        lightbox.showModal();
    }

    function cerrarLightbox() {
        lightbox.close();
    }

    function cambiarA(nuevoIndice) {
        if (animando || nuevoIndice === indiceActual) return;
        animando = true;
        figura.classList.add("cambiando");

        setTimeout(() => {
            indiceActual = nuevoIndice;
            actualizarImagen();
            // Doble RAF: aseguramos que el nuevo estado se pinte antes de quitar la clase
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    figura.classList.remove("cambiando");
                    animando = false;
                });
            });
        }, DURACION_CAMBIO);
    }

    function anterior() {
        cambiarA((indiceActual - 1 + items.length) % items.length);
    }

    function siguiente() {
        cambiarA((indiceActual + 1) % items.length);
    }

    items.forEach((img, i) => {
        const tarjeta = img.closest(".grid-catalogo-item");
        (tarjeta || img.parentElement).addEventListener("click", () => abrirLightbox(i));
    });

    btnClose.addEventListener("click", cerrarLightbox);
    btnPrev.addEventListener("click", anterior);
    btnNext.addEventListener("click", siguiente);

    // Click en el backdrop (fuera del contenido) cierra el diálogo
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) cerrarLightbox();
    });

    // Flechas izq/der para navegar (ESC ya lo gestiona el <dialog> de forma nativa)
    lightbox.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            anterior();
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            siguiente();
        }
    });
}
