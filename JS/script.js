
/* ==================================================
   MATRIXCALC - LÓGICA PRINCIPAL
   ================================================== */

"use strict";

let filas = 2;
let columnas = 2;
let dimensionPersonalizada = false;
let pasoActual = 1;

/* ==================================================
   NAVEGACIÓN
   ================================================== */

function mostrarSeccion(nombre) {
    document.querySelectorAll(".seccion").forEach(function(seccion) {
        seccion.classList.remove("activa");
    });

    const destino = document.getElementById(nombre);

    if (destino) {
        destino.classList.add("activa");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ==================================================
   MENSAJES
   ================================================== */

function mostrarMensaje(mensaje, esError = false) {
    const elemento = document.getElementById("mensajeSistema");

    elemento.textContent = mensaje;
    elemento.classList.toggle("error", esError);
    elemento.hidden = false;
}

function ocultarMensaje() {
    const elemento = document.getElementById("mensajeSistema");

    elemento.textContent = "";
    elemento.classList.remove("error");
    elemento.hidden = true;
}

/* ==================================================
   SELECCIÓN DE DIMENSIONES
   ================================================== */

function seleccionarDimension(f, c, boton) {
    filas = f;
    columnas = c;
    dimensionPersonalizada = false;

    document.getElementById("filas").value = f;
    document.getElementById("columnas").value = c;

    document.getElementById("configuracionPersonalizada").hidden = true;

    document.querySelectorAll(".tarjeta-dimension").forEach(function(tarjeta) {
        tarjeta.classList.remove("seleccionada");
    });

    boton.classList.add("seleccionada");

    document.getElementById("mensajeDimension").textContent =
        `Dimensiones seleccionadas: ${f} × ${c}`;

    ocultarMensaje();
}

function mostrarPersonalizado(boton) {
    dimensionPersonalizada = true;

    document.querySelectorAll(".tarjeta-dimension").forEach(function(tarjeta) {
        tarjeta.classList.remove("seleccionada");
    });

    boton.classList.add("seleccionada");

    document.getElementById("configuracionPersonalizada").hidden = false;

    document.getElementById("mensajeDimension").textContent =
        "Selecciona entre 1 y 8 filas y columnas.";

    ocultarMensaje();
}

/* ==================================================
   CREAR MATRICES
   ================================================== */

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
        mostrarMensaje(
            "Ingresa un número de filas y columnas entre 1 y 8.",
            true
        );
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

    mostrarMensaje(
        "Matrices creadas. Ingresa los valores y selecciona una operación."
    );

    mostrarSeccion("operaciones");

    contenedor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function crearMatriz(contenedor, nombre) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "matriz-card";

    const titulo = document.createElement("h2");
    titulo.textContent = `Matriz ${nombre}`;
    tarjeta.appendChild(titulo);

    const matriz = document.createElement("div");
    matriz.className = "matriz";
    matriz.style.gridTemplateColumns = `repeat(${columnas}, max-content)`;

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const input = document.createElement("input");

            input.type = "number";
            input.step = "any";
            input.inputMode = "decimal";
            input.id = `matriz${nombre}-${i}-${j}`;
            input.setAttribute(
                "aria-label",
                `Matriz ${nombre}, fila ${i + 1}, columna ${j + 1}`
            );
            input.placeholder = "0";

            matriz.appendChild(input);
        }
    }

    tarjeta.appendChild(matriz);
    contenedor.appendChild(tarjeta);
}

/* ==================================================
   LEER Y VALIDAR MATRICES
   ================================================== */

function obtenerMatriz(nombre) {
    const matriz = [];

    for (let i = 0; i < filas; i++) {
        matriz[i] = [];

        for (let j = 0; j < columnas; j++) {
            const input = document.getElementById(
                `matriz${nombre}-${i}-${j}`
            );

            if (!input || input.value.trim() === "") {
                if (input) {
                    input.focus();
                }

                throw new Error(
                    `Completa la celda (${i + 1}, ${j + 1}) de la Matriz ${nombre}.`
                );
            }

            const valor = Number(input.value);

            if (!Number.isFinite(valor)) {
                input.focus();
                throw new Error(
                    `El valor de la celda (${i + 1}, ${j + 1}) de la Matriz ${nombre} no es válido.`
                );
            }

            matriz[i][j] = valor;
        }
    }

    return matriz;
}

/* ==================================================
   EJECUTAR OPERACIONES
   ================================================== */

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
                resultado[i][j] =
                    operador === "+"
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

/* ==================================================
   MOSTRAR RESULTADO
   ================================================== */

function formatearNumero(numero) {
    if (Object.is(numero, -0)) {
        return "0";
    }

    return String(Number(numero.toPrecision(12)));
}

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

/* ==================================================
   MOSTRAR PROCEDIMIENTO
   ================================================== */

function mostrarProcedimiento(A, B, resultado, operador) {
    const contenedor = document.getElementById("contenidoProcedimiento");
    contenedor.replaceChildren();

    const descripcion = document.createElement("p");
    descripcion.className = "titulo-procedimiento";
    descripcion.textContent = operador === "+"
        ? "Sumamos los elementos correspondientes:"
        : "Restamos los elementos correspondientes:";

    contenedor.appendChild(descripcion);

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

/* ==================================================
   BOTÓN LIMPIAR
   ================================================== */

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

    mostrarMensaje(
        "Operación limpiada. Puedes crear matrices nuevas."
    );
}

/* ==================================================
   TUTORIAL INTERACTIVO
   ================================================== */

const tutorial = [
    {
        titulo: "Seleccionar dimensiones",
        descripcion:
            "Selecciona una matriz de 2×2, 3×3 o 4×4. También puedes elegir Personalizado para definir filas y columnas entre 1 y 8.",
        icono: "▦",
        imagen: "img/tutorial/paso1.png"
    },
    {
        titulo: "Ingresar la Matriz A",
        descripcion:
            "Presiona Crear matrices y escribe cada valor de la Matriz A en su fila y columna correspondiente. No dejes celdas vacías.",
        icono: "A",
        imagen: "img/tutorial/paso2.png"
    },
    {
        titulo: "Ingresar la Matriz B",
        descripcion:
            "Completa de la misma manera los valores de la Matriz B. Ambas matrices tendrán las mismas dimensiones.",
        icono: "B",
        imagen: "img/tutorial/paso3.png"
    },
    {
        titulo: "Seleccionar una operación",
        descripcion:
            "Presiona Sumar para sumar los elementos correspondientes o Restar para calcular la diferencia entre ellos.",
        icono: "＋ −",
        imagen: "img/tutorial/paso4.png"
    },
    {
        titulo: "Consultar el procedimiento",
        descripcion:
            "El sistema presenta las operaciones de cada posición para que puedas comprobar cómo se obtuvo cada resultado.",
        icono: "＝",
        imagen: "img/tutorial/paso5.png"
    },
    {
        titulo: "Ver el resultado y limpiar",
        descripcion:
            "Consulta la matriz final. Cuando quieras comenzar desde cero, presiona Limpiar y crea una nueva operación.",
        icono: "✓",
        imagen: "img/tutorial/paso6.png"
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
        `${(pasoActual / tutorial.length) * 100}%`;

    document.getElementById("btnAnterior").disabled =
        pasoActual === 1;

    document.getElementById("btnSiguiente").textContent =
        pasoActual === tutorial.length ? "Volver al inicio ↺" : "Siguiente →";

    const imagen = document.getElementById("imagenTutorial");
    const visual = document.getElementById("tutorialVisual");

    imagen.hidden = true;
    visual.hidden = false;
    imagen.alt = paso.titulo;

    // Evitar mostrar imágenes antiguas o una imagen rota
    imagen.onerror = function() {
        imagen.hidden = true;
        visual.hidden = false;
    };

    imagen.onload = function() {
        imagen.hidden = false;
        visual.hidden = true;
    };

    imagen.src = paso.imagen;
}

function siguientePaso() {
    if (pasoActual < tutorial.length) {
        pasoActual++;
    } else {
        pasoActual = 1;
    }

    mostrarPaso();
}

function pasoAnterior() {
    if (pasoActual > 1) {
        pasoActual--;
        mostrarPaso();
    }
}

/* ==================================================
   INICIALIZACIÓN
   ================================================== */

document.addEventListener("DOMContentLoaded", function() {
    mostrarPaso();
});
