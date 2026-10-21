
"use strict";

let filas = 2;
let columnas = 2;
let dimensionPersonalizada = false;
let pasoActual = 1;

/* NAVEGACIÓN */
function mostrarSeccion(nombre) {
    document.querySelectorAll(".seccion").forEach(s => {
        s.classList.remove("activa");
    });

    const seccion = document.getElementById(nombre);
    if (seccion) seccion.classList.add("activa");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* MENSAJES */
function mostrarMensaje(texto, error = false) {
    const mensaje = document.getElementById("mensajeSistema");
    mensaje.textContent = texto;
    mensaje.classList.toggle("error", error);
    mensaje.hidden = false;
}

function ocultarMensaje() {
    const mensaje = document.getElementById("mensajeSistema");
    mensaje.textContent = "";
    mensaje.classList.remove("error");
    mensaje.hidden = true;
}

/* DIMENSIONES */
function seleccionarDimension(f, c, boton) {
    filas = f;
    columnas = c;
    dimensionPersonalizada = false;

    document.getElementById("filas").value = f;
    document.getElementById("columnas").value = c;
    document.getElementById("configuracionPersonalizada").hidden = true;

    document.querySelectorAll(".tarjeta-dimension").forEach(t => {
        t.classList.remove("seleccionada");
    });
    boton.classList.add("seleccionada");

    document.getElementById("mensajeDimension").textContent =
        `Dimensiones seleccionadas: ${f} × ${c}`;

    ocultarMensaje();
}

function mostrarPersonalizado(boton) {
    dimensionPersonalizada = true;

    document.querySelectorAll(".tarjeta-dimension").forEach(t => {
        t.classList.remove("seleccionada");
    });
    boton.classList.add("seleccionada");

    document.getElementById("configuracionPersonalizada").hidden = false;
    document.getElementById("mensajeDimension").textContent =
        "Selecciona entre 1 y 8 filas y columnas.";

    ocultarMensaje();
}

/* CREACIÓN DE MATRICES */
function crearMatrices() {
    ocultarMensaje();

    if (dimensionPersonalizada) {
        filas = Number(document.getElementById("filas").value);
        columnas = Number(document.getElementById("columnas").value);
    }

    if (
        !Number.isInteger(filas) ||
        !Number.isInteger(columnas) ||
        filas < 1 || filas > 8 ||
        columnas < 1 || columnas > 8
    ) {
        mostrarMensaje("Ingresa entre 1 y 8 filas y columnas.", true);
        return;
    }

    const contenedor = document.getElementById("contenedorMatrices");
    contenedor.replaceChildren();

    crearMatriz(contenedor, "A");
    crearMatriz(contenedor, "B");

    contenedor.hidden = false;
    document.getElementById("botonesOperacion").hidden = false;
    document.getElementById("resultado").hidden = true;
    document.getElementById("procedimiento").hidden = true;

    document.getElementById("matrizResultado").replaceChildren();
    document.getElementById("contenidoProcedimiento").replaceChildren();

    document.getElementById("mensajeDimension").textContent =
        `Matrices listas: ${filas} × ${columnas}`;

    mostrarMensaje("Ingresa los valores de las matrices y elige una operación.");

    mostrarSeccion("operaciones");
    contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
}

function crearMatriz(contenedor, nombre) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "matriz-card";

    const titulo = document.createElement("h2");
    titulo.textContent = `Matriz ${nombre}`;
    tarjeta.appendChild(titulo);

    const tabla = document.createElement("div");
    tabla.className = "matriz";
    tabla.style.gridTemplateColumns = `repeat(${columnas}, max-content)`;

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const input = document.createElement("input");

            input.type = "number";
            input.step = "any";
            input.inputMode = "decimal";
            input.id = `matriz${nombre}-${i}-${j}`;
            input.placeholder = "0";
            input.setAttribute(
                "aria-label",
                `Matriz ${nombre}, fila ${i + 1}, columna ${j + 1}`
            );

            tabla.appendChild(input);
        }
    }

    tarjeta.appendChild(tabla);
    contenedor.appendChild(tarjeta);
}

/* LECTURA Y VALIDACIÓN */
function obtenerMatriz(nombre) {
    const matriz = [];

    for (let i = 0; i < filas; i++) {
        matriz[i] = [];

        for (let j = 0; j < columnas; j++) {
            const input = document.getElementById(
                `matriz${nombre}-${i}-${j}`
            );

            if (!input || input.value.trim() === "") {
                if (input) input.focus();
                throw new Error(
                    `Completa la celda (${i + 1}, ${j + 1}) de la Matriz ${nombre}.`
                );
            }

            const valor = Number(input.value);

            if (!Number.isFinite(valor)) {
                input.focus();
                throw new Error("Ingresa únicamente valores numéricos válidos.");
            }

            matriz[i][j] = valor;
        }
    }

    return matriz;
}

/* SUMA Y RESTA */
function sumarMatrices() {
    ejecutarOperacion("+");
}

function restarMatrices() {
    ejecutarOperacion("-");
}

function ejecutarOperacion(operador) {
    ocultarMensaje();

    if (document.getElementById("contenedorMatrices").hidden) {
        mostrarMensaje("Primero debes crear las matrices.", true);
        return;
    }

    try {
        const A = obtenerMatriz("A");
        const B = obtenerMatriz("B");
        const resultado = [];

        for (let i = 0; i < filas; i++) {
            resultado[i] = [];

            for (let j = 0; j < columnas; j++) {
                resultado[i][j] = operador === "+"
                    ? A[i][j] + B[i][j]
                    : A[i][j] - B[i][j];
            }
        }

        mostrarResultado(resultado, operador);
        mostrarProcedimiento(A, B, resultado, operador);

        document.getElementById("resultado").hidden = false;
        document.getElementById("procedimiento").hidden = false;

        mostrarMensaje(
            operador === "+"
                ? "Suma realizada correctamente."
                : "Resta realizada correctamente."
        );
    } catch (error) {
        mostrarMensaje(error.message, true);
    }
}

/* FORMATO NUMÉRICO */
function formatearNumero(numero) {
    if (Object.is(numero, -0)) return "0";
    return String(Number(numero.toPrecision(12)));
}

/* RESULTADO */
function mostrarResultado(matriz, operador) {
    const contenedor = document.getElementById("matrizResultado");
    contenedor.replaceChildren();

    document.getElementById("tituloResultado").textContent =
        operador === "+" ? "A + B" : "A − B";

    const tabla = document.createElement("div");
    tabla.className = "matriz-resultado";
    tabla.style.gridTemplateColumns = `repeat(${columnas}, max-content)`;

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const celda = document.createElement("div");
            celda.className = "resultado-celda";
            celda.textContent = formatearNumero(matriz[i][j]);
            tabla.appendChild(celda);
        }
    }

    contenedor.appendChild(tabla);
}

/* PROCEDIMIENTO */
function mostrarProcedimiento(A, B, resultado, operador) {
    const contenedor = document.getElementById("contenidoProcedimiento");
    contenedor.replaceChildren();

    const introduccion = document.createElement("p");
    introduccion.className = "titulo-procedimiento";
    introduccion.textContent = operador === "+"
        ? "Sumamos los elementos correspondientes:"
        : "Restamos los elementos correspondientes:";

    contenedor.appendChild(introduccion);

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const paso = document.createElement("div");
            paso.className = "paso-calculo";
            paso.textContent =
                `Elemento (${i + 1}, ${j + 1}): ` +
                `${formatearNumero(A[i][j])} ${operador} ` +
                `${formatearNumero(B[i][j])} = ` +
                `${formatearNumero(resultado[i][j])}`;

            contenedor.appendChild(paso);
        }
    }

    const conclusion = document.createElement("p");
    conclusion.className = "titulo-procedimiento";
    conclusion.textContent =
        "El resultado se obtiene operando cada posición de ambas matrices.";

    contenedor.appendChild(conclusion);
}

/* LIMPIAR: OCULTA MATRICES, RESULTADO Y BOTONES */
function limpiarMatrices() {
    document.getElementById("contenedorMatrices").replaceChildren();
    document.getElementById("contenedorMatrices").hidden = true;

    document.getElementById("botonesOperacion").hidden = true;
    document.getElementById("resultado").hidden = true;
    document.getElementById("procedimiento").hidden = true;

    document.getElementById("matrizResultado").replaceChildren();
    document.getElementById("contenidoProcedimiento").replaceChildren();
    document.getElementById("tituloResultado").textContent = "";

    document.getElementById("mensajeDimension").textContent =
        `Dimensiones seleccionadas: ${filas} × ${columnas}`;

    mostrarMensaje("Matrices limpiadas. Puedes crear una nueva operación.");
}

/* TUTORIAL */
const tutorial = [
    {
        titulo: "Seleccionar dimensiones",
        descripcion: "Selecciona 2×2, 3×3, 4×4 o Personalizado para definir filas y columnas.",
        icono: "▦"
    },
    {
        titulo: "Ingresar la Matriz A",
        descripcion: "Presiona Crear matrices y escribe los valores en cada celda de la Matriz A.",
        icono: "A"
    },
    {
        titulo: "Ingresar la Matriz B",
        descripcion: "Completa las celdas de la Matriz B. Las dos matrices deben tener las mismas dimensiones.",
        icono: "B"
    },
    {
        titulo: "Seleccionar una operación",
        descripcion: "Presiona Sumar o Restar para operar los elementos que ocupan la misma posición.",
        icono: "＋ −"
    },
    {
        titulo: "Consultar el procedimiento",
        descripcion: "Revisa la operación de cada elemento para comprender cómo se obtuvo el resultado.",
        icono: "＝"
    },
    {
        titulo: "Limpiar y comenzar otra vez",
        descripcion: "Presiona Limpiar para borrar las matrices y el resultado antes de comenzar una nueva operación.",
        icono: "✓"
    }
];

function mostrarPaso() {
    const paso = tutorial[pasoActual - 1];

    document.getElementById("numeroPaso").textContent =
        `PASO ${pasoActual} DE ${tutorial.length}`;
    document.getElementById("tituloPaso").textContent = paso.titulo;
    document.getElementById("descripcionPaso").textContent = paso.descripcion;
    document.getElementById("tutorialIcono").textContent = paso.icono;

    document.getElementById("barraProgreso").style.width =
        `${pasoActual / tutorial.length * 100}%`;

    document.getElementById("btnAnterior").disabled = pasoActual === 1;
    document.getElementById("btnSiguiente").textContent =
        pasoActual === tutorial.length ? "Volver al inicio ↺" : "Siguiente →";
}

function siguientePaso() {
    pasoActual = pasoActual < tutorial.length ? pasoActual + 1 : 1;
    mostrarPaso();
}

function pasoAnterior() {
    if (pasoActual > 1) {
        pasoActual--;
        mostrarPaso();
    }
}

/* INICIALIZACIÓN */
document.addEventListener("DOMContentLoaded", function() {
    mostrarPaso();
});
