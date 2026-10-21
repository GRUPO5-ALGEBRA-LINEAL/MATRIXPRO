/* =========================================================
   MATRIXCALC
   JavaScript principal
   ========================================================= */


/* ==================== NAVEGACIÓN ==================== */

function mostrarSeccion(nombreSeccion) {

    const secciones =
        document.querySelectorAll(".seccion");


    secciones.forEach(function(seccion) {

        seccion.classList.remove("activa");

    });


    const seccionSeleccionada =
        document.getElementById(nombreSeccion);


    if (seccionSeleccionada) {

        seccionSeleccionada.classList.add("activa");

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ==================== VARIABLES ==================== */

let filas = 2;

let columnas = 2;


/* ==================== CREAR MATRICES ==================== */

function crearMatrices() {

    filas = parseInt(
        document.getElementById("filas").value
    );


    columnas = parseInt(
        document.getElementById("columnas").value
    );


    const contenedor =
        document.getElementById(
            "contenedorMatrices"
        );


    contenedor.innerHTML = "";


   crearMatriz(contenedor, "A");
crearMatriz(contenedor, "B");

// Mostrar los botones al crear las matrices
document.getElementById("botonesOperacion").hidden = false;

document.getElementById("resultado").style.display = "block";
document.getElementById("procedimiento").style.display = "block";

}


/* ==================== CREAR UNA MATRIZ ==================== */

function crearMatriz(contenedor, nombre) {

    const tarjeta =
        document.createElement("div");


    tarjeta.className =
        "matriz-card";


    const titulo =
        document.createElement("h2");


    titulo.textContent =
        "Matriz " + nombre;


    tarjeta.appendChild(titulo);


    const matriz =
        document.createElement("div");


    matriz.className =
        "matriz";


    matriz.style.gridTemplateColumns =
        `repeat(${columnas}, 65px)`;


    for (
        let i = 0;
        i < filas;
        i++
    ) {

        for (
            let j = 0;
            j < columnas;
            j++
        ) {

            const input =
                document.createElement(
                    "input"
                );


            input.type = "number";


            input.value = "0";


            input.id =
                `matriz${nombre}-${i}-${j}`;


            input.setAttribute(
                "aria-label",
                `Matriz ${nombre}, fila ${i + 1}, columna ${j + 1}`
            );


            matriz.appendChild(input);

        }

    }


    tarjeta.appendChild(matriz);


    contenedor.appendChild(tarjeta);

}


/* ==================== OBTENER MATRIZ ==================== */

function obtenerMatriz(nombre) {

    const matriz = [];


    for (
        let i = 0;
        i < filas;
        i++
    ) {

        matriz[i] = [];


        for (
            let j = 0;
            j < columnas;
            j++
        ) {

            const input =
                document.getElementById(
                    `matriz${nombre}-${i}-${j}`
                );


            matriz[i][j] =
                Number(input.value);

        }

    }


    return matriz;

}


/* ==================== MOSTRAR RESULTADO ==================== */

function mostrarResultado(matriz) {

    const contenedor =
        document.getElementById(
            "matrizResultado"
        );


    contenedor.innerHTML = "";


    const tabla =
        document.createElement("div");


    tabla.className =
        "matriz-resultado";


    tabla.style.gridTemplateColumns =
        `repeat(${columnas}, 65px)`;


    for (
        let i = 0;
        i < filas;
        i++
    ) {

        for (
            let j = 0;
            j < columnas;
            j++
        ) {

            const celda =
                document.createElement(
                    "div"
                );


            celda.className =
                "resultado-celda";


            celda.textContent =
                matriz[i][j];


            tabla.appendChild(celda);

        }

    }


    contenedor.appendChild(tabla);

}


/* ==================== SUMA ==================== */

function sumarMatrices() {

    const A =
        obtenerMatriz("A");


    const B =
        obtenerMatriz("B");


    const resultado = [];


    for (
        let i = 0;
        i < filas;
        i++
    ) {

        resultado[i] = [];


        for (
            let j = 0;
            j < columnas;
            j++
        ) {

            resultado[i][j] =
                A[i][j] + B[i][j];

        }

    }


    mostrarResultado(resultado);


    mostrarProcedimiento(
        A,
        B,
        resultado,
        "+"
    );

}


/* ==================== RESTA ==================== */

function restarMatrices() {

    const A =
        obtenerMatriz("A");


    const B =
        obtenerMatriz("B");


    const resultado = [];


    for (
        let i = 0;
        i < filas;
        i++
    ) {

        resultado[i] = [];


        for (
            let j = 0;
            j < columnas;
            j++
        ) {

            resultado[i][j] =
                A[i][j] - B[i][j];

        }

    }


    mostrarResultado(resultado);


    mostrarProcedimiento(
        A,
        B,
        resultado,
        "-"
    );

}


/* ==================== PROCEDIMIENTO ==================== */

function mostrarProcedimiento(
    A,
    B,
    resultado,
    operador
) {

    const contenedor =
        document.getElementById(
            "contenidoProcedimiento"
        );


    contenedor.innerHTML = "";


    for (
        let i = 0;
        i < filas;
        i++
    ) {

        for (
            let j = 0;
            j < columnas;
            j++
        ) {

            const paso =
                document.createElement(
                    "div"
                );


            paso.className =
                "paso-calculo";


            paso.textContent =
                `Elemento (${i + 1}, ${j + 1}): `
                + `${A[i][j]} ${operador} ${B[i][j]} = `
                + `${resultado[i][j]}`;


            contenedor.appendChild(paso);

        }

    }

}


/* ==================== LIMPIAR ==================== */

function limpiarMatrices() {

    document.getElementById(
        "contenedorMatrices"
    ).innerHTML = "";


    document.getElementById(
        "matrizResultado"
    ).innerHTML =
        "Aquí aparecerá el resultado.";


    document.getElementById(
        "contenidoProcedimiento"
    ).innerHTML =
        "El procedimiento aparecerá aquí.";

}


/* =========================================================
   TUTORIAL
   ========================================================= */

let pasoActual = 1;


const tutorial = [

    {
        titulo:
            "Seleccionar dimensiones",

        descripcion:
            "Seleccione el número de filas y columnas que tendrán las matrices.",

        imagen:
            "img/tutorial/paso1.png"
    },


    {
        titulo:
            "Ingresar Matriz A",

        descripcion:
            "Introduzca los valores correspondientes a la Matriz A.",

        imagen:
            "img/tutorial/paso2.png"
    },


    {
        titulo:
            "Ingresar Matriz B",

        descripcion:
            "Introduzca los valores correspondientes a la Matriz B.",

        imagen:
            "img/tutorial/paso3.png"
    },


    {
        titulo:
            "Seleccionar operación",

        descripcion:
            "Seleccione si desea realizar una suma o una resta.",

        imagen:
            "img/tutorial/paso4.png"
    },


    {
        titulo:
            "Ver procedimiento",

        descripcion:
            "El sistema mostrará paso a paso cómo se realizó la operación.",

        imagen:
            "img/tutorial/paso5.png"
    },


    {
        titulo:
            "Ver resultado",

        descripcion:
            "Finalmente podrá observar la matriz resultante.",

        imagen:
            "img/tutorial/paso6.png"
    }

];


/* ==================== MOSTRAR PASO ==================== */

function mostrarPaso() {

    const paso =
        tutorial[pasoActual - 1];


    document.getElementById(
        "numeroPaso"
    ).textContent =
        `Paso ${pasoActual} de ${tutorial.length}`;


    document.getElementById(
        "tituloPaso"
    ).textContent =
        paso.titulo;


    document.getElementById(
        "descripcionPaso"
    ).textContent =
        paso.descripcion;


    document.getElementById(
        "imagenTutorial"
    ).src =
        paso.imagen;

}


/* ==================== SIGUIENTE ==================== */

function siguientePaso() {

    if (
        pasoActual <
        tutorial.length
    ) {

        pasoActual++;

        mostrarPaso();

    }

}


/* ==================== ANTERIOR ==================== */

function pasoAnterior() {

    if (
        pasoActual > 1
    ) {

        pasoActual--;

        mostrarPaso();

    }

}


/* ==================== INICIO ==================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        mostrarPaso();

    }
);
