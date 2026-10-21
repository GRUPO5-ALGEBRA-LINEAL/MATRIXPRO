
"use strict";

const tarjetasDimension = document.querySelectorAll(".tarjeta-dimension");
const personalizada = document.getElementById("personalizada");
const filasInput = document.getElementById("filas");
const columnasInput = document.getElementById("columnas");
const crearPersonalizada = document.getElementById("crearPersonalizada");

const estadoSeleccion = document.getElementById("estadoSeleccion");
const areaMatrices = document.getElementById("areaMatrices");
const matrizA = document.getElementById("matrizA");
const matrizB = document.getElementById("matrizB");
const botonesOperacion = document.getElementById("botonesOperacion");

const botonSumar = document.getElementById("sumar");
const botonRestar = document.getElementById("restar");
const botonLimpiar = document.getElementById("limpiar");

const panelResultado = document.getElementById("panelResultado");
const tituloResultado = document.getElementById("tituloResultado");
const resultado = document.getElementById("resultado");
const procedimiento = document.getElementById("procedimiento");

let filasActuales = 0;
let columnasActuales = 0;

function mostrarEstado(mensaje, tipo = "") {
    estadoSeleccion.textContent = mensaje;
    estadoSeleccion.className = "estado";

    if (tipo) {
        estadoSeleccion.classList.add(tipo);
    }
}

function seleccionarTarjeta(tarjetaSeleccionada) {
    tarjetasDimension.forEach((tarjeta) => {
        tarjeta.classList.toggle(
            "seleccionada",
            tarjeta === tarjetaSeleccionada
        );
    });
}

function ocultarResultado() {
    panelResultado.classList.add("oculto");
    resultado.replaceChildren();
    procedimiento.replaceChildren();
}

function crearMatrices(filas, columnas) {
    if (
        !Number.isInteger(filas) ||
        !Number.isInteger(columnas) ||
        filas < 1 ||
        filas > 8 ||
        columnas < 1 ||
        columnas > 8
    ) {
        mostrarEstado(
            "Las filas y columnas deben estar entre 1 y 8.",
            "error"
        );
        return;
    }

    filasActuales = filas;
    columnasActuales = columnas;

    crearMatriz(matrizA, filas, columnas, "A");
    crearMatriz(matrizB, filas, columnas, "B");

    areaMatrices.classList.remove("oculto");
    botonesOperacion.classList.remove("oculto");
    personalizada.classList.add("oculto");

    ocultarResultado();

    mostrarEstado(
        `Matrices ${filas} × ${columnas} creadas. Ingresa los valores.`,
        "exito"
    );

    document.getElementById("operaciones").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function crearMatriz(contenedor, filas, columnas, nombre) {
    contenedor.replaceChildren();
    contenedor.style.gridTemplateColumns =
        `repeat(${columnas}, minmax(0, 1fr))`;

    for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {
            const entrada = document.createElement("input");

            entrada.type = "number";
            entrada.step = "any";
            entrada.inputMode = "decimal";
            entrada.className = "celda";
            entrada.placeholder = "0";
            entrada.setAttribute(
                "aria-label",
                `Matriz ${nombre}, fila ${fila + 1}, columna ${columna + 1}`
            );
            entrada.title =
                `${nombre}[${fila + 1}, ${columna + 1}]`;

            entrada.addEventListener("input", ocultarResultado);

            contenedor.appendChild(entrada);
        }
    }
}

function obtenerValores(contenedor, nombre) {
    const entradas = Array.from(
        contenedor.querySelectorAll("input")
    );

    const valores = [];
    let indice = 0;

    for (let fila = 0; fila < filasActuales; fila++) {
        const filaValores = [];

        for (
            let columna = 0;
            columna < columnasActuales;
            columna++
        ) {
            const entrada = entradas[indice];
            const texto = entrada.value.trim();

            if (texto === "" || !Number.isFinite(Number(texto))) {
                entrada.focus();

                throw new Error(
                    `Completa con un número válido la celda ` +
                    `${nombre}[${fila + 1}, ${columna + 1}].`
                );
            }

            filaValores.push(Number(texto));
            indice++;
        }

        valores.push(filaValores);
    }

    return valores;
}

function formatearNumero(numero) {
    if (Object.is(numero, -0)) {
        numero = 0;
    }

    if (Number.isInteger(numero)) {
        return String(numero);
    }

    return String(Number(numero.toFixed(8)));
}

function realizarOperacion(operacion) {
    if (filasActuales === 0 || columnasActuales === 0) {
        mostrarEstado(
            "Primero selecciona las dimensiones de las matrices.",
            "error"
        );
        return;
    }

    try {
        const valoresA = obtenerValores(matrizA, "A");
        const valoresB = obtenerValores(matrizB, "B");

        const signo = operacion === "suma" ? "+" : "−";
        const nombreOperacion =
            operacion === "suma" ? "Suma" : "Resta";

        const matrizResultado = [];
        const pasos = [];

        for (let fila = 0; fila < filasActuales; fila++) {
            const filaResultado = [];

            for (
                let columna = 0;
                columna < columnasActuales;
                columna++
            ) {
                const a = valoresA[fila][columna];
                const b = valoresB[fila][columna];

                const valor =
                    operacion === "suma" ? a + b : a - b;

                filaResultado.push(valor);

                pasos.push({
                    fila: fila + 1,
                    columna: columna + 1,
                    a,
                    b,
                    signo,
                    valor
                });
            }

            matrizResultado.push(filaResultado);
        }

        mostrarResultado(
            matrizResultado,
            pasos,
            nombreOperacion
        );

        mostrarEstado(
            `${nombreOperacion} realizada correctamente.`,
            "exito"
        );
    } catch (error) {
        mostrarEstado(error.message, "error");
        ocultarResultado();
    }
}

function mostrarResultado(matriz, pasos, nombreOperacion) {
    tituloResultado.textContent = `Resultado de la ${nombreOperacion.toLowerCase()}`;

    resultado.replaceChildren();
    resultado.style.gridTemplateColumns =
        `repeat(${columnasActuales}, minmax(0, 1fr))`;

    matriz.forEach((fila) => {
        fila.forEach((valor) => {
            const celda = document.createElement("div");
            celda.className = "celda-resultado";
            celda.textContent = formatearNumero(valor);
            resultado.appendChild(celda);
        });
    });

    procedimiento.replaceChildren();

    pasos.forEach((paso) => {
        const linea = document.createElement("div");
        linea.className = "linea-procedimiento";

        const explicacion = document.createElement("span");
        explicacion.textContent =
            `C[${paso.fila}, ${paso.columna}] = ` +
            `${formatearNumero(paso.a)} ${paso.signo} ` +
            `${formatearNumero(paso.b)} = ` +
            `${formatearNumero(paso.valor)}`;

        linea.appendChild(explicacion);
        procedimiento.appendChild(linea);
    });

    panelResultado.classList.remove("oculto");

    panelResultado.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

function limpiarMatrices() {
    filasActuales = 0;
    columnasActuales = 0;

    areaMatrices.classList.add("oculto");
    botonesOperacion.classList.add("oculto");
    personalizada.classList.add("oculto");

    matrizA.replaceChildren();
    matrizB.replaceChildren();

    seleccionarTarjeta(null);
    ocultarResultado();

    mostrarEstado("Selecciona una dimensión para comenzar.");
}

tarjetasDimension.forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
        const dimension = tarjeta.dataset.size;

        seleccionarTarjeta(tarjeta);

        if (dimension === "custom") {
            personalizada.classList.remove("oculto");
            mostrarEstado(
                "Indica las filas y columnas de tus matrices."
            );

            personalizada.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            return;
        }

        const tamano = Number(dimension);
        crearMatrices(tamano, tamano);
    });
});

crearPersonalizada.addEventListener("click", () => {
    const filas = Number(filasInput.value);
    const columnas = Number(columnasInput.value);

    crearMatrices(filas, columnas);
});

botonSumar.addEventListener("click", () => {
    realizarOperacion("suma");
});

botonRestar.addEventListener("click", () => {
    realizarOperacion("resta");
});

botonLimpiar.addEventListener("click", limpiarMatrices);
