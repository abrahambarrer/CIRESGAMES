let num1, num2;
let respuesta;
let indiceOpCorrecta;

let puntos = 0;
let errores = 0;
let tiempo = 0;
let dificultad = 10; // Rango inicial para los números
let intervalo;

let txt_multi = document.getElementById("multiplicacion");
let op1 = document.getElementById("op1");
let op2 = document.getElementById("op2");
let op3 = document.getElementById("op3");
let txt_menj = document.getElementById("menj");
let txt_resultado = document.getElementById("resultado");

function comenzar() {
    txt_resultado.innerHTML = "?";
    txt_menj.innerHTML = "";

    // Aumentar dificultad cada 2 aciertos
    dificultad = 20 + Math.floor(puntos / 2) * 10;

    num1 = Math.floor(Math.random() * (dificultad - 10)) + 10;
    num2 = Math.floor(Math.random() * (dificultad - 10)) + 10;

    // Elegir aleatoriamente entre suma o resta
    let operacion = Math.random() < 0.5 ? "+" : "-";

    if (operacion === "+") {
        respuesta = num1 + num2;
        txt_multi.innerHTML = `${num1} + ${num2} =`;
    } else {
        // Asegurarse que no haya resultados negativos
        if (num1 < num2) [num1, num2] = [num2, num1];
        respuesta = num1 - num2;
        txt_multi.innerHTML = `${num1} - ${num2} =`;
    }

    indiceOpCorrecta = Math.floor(Math.random() * 3);

    let respuestas = [];

    // Generar respuestas incorrectas únicas
    while (respuestas.length < 2) {
        let falsa = respuesta + Math.floor(Math.random() * 10) - 5;
        if (falsa !== respuesta && !respuestas.includes(falsa) && falsa >= 0) {
            respuestas.push(falsa);
        }
    }

    respuestas.splice(indiceOpCorrecta, 0, respuesta);

    op1.innerHTML = respuestas[0];
    op2.innerHTML = respuestas[1];
    op3.innerHTML = respuestas[2];

    // Restablecer color de los botones
    op1.style.backgroundColor = "#fff";
    op2.style.backgroundColor = "#fff";
    op3.style.backgroundColor = "#fff";
}

function controlarRespuesta(opcionElegida) {
    txt_resultado.innerHTML = opcionElegida.innerHTML;

    if (respuesta == parseInt(opcionElegida.innerHTML)) {
        txt_menj.innerHTML = "EXCELENTE!!!";
        txt_menj.style.color = "#dafd10";
        puntos++;
        document.getElementById("puntos").innerHTML = `Puntos: ${puntos}`;
        opcionElegida.style.backgroundColor = "#00FF70";
        setTimeout(comenzar, 1200);
    } else {
        errores++;
        txt_menj.innerHTML = "INTENTA DE NUEVO!!!";
        txt_menj.style.color = "red";
        document.getElementById("errores").innerHTML = `Errores: ${errores}/3`;
        opcionElegida.style.backgroundColor = "#FF6666";

        if (errores >= 3) {
            txt_menj.innerHTML = "😵¡Juego Terminado!";
            clearInterval(intervalo);
            desactivarOpciones();
        } else {
            setTimeout(limpiar, 1200);
        }
    }
}

function limpiar() {
    txt_resultado.innerHTML = "?";
    txt_menj.innerHTML = "";
    op1.style.backgroundColor = "#fff";
    op2.style.backgroundColor = "#fff";
    op3.style.backgroundColor = "#fff";
}

function desactivarOpciones() {
    op1.onclick = null;
    op2.onclick = null;
    op3.onclick = null;
}

function iniciarCronometro() {
    intervalo = setInterval(() => {
        tiempo++;
        document.getElementById("cronometro").innerHTML = `Tiempo: ${tiempo}s`;
    }, 1000);
}

function reiniciarJuego() {
    puntos = 0;
    errores = 0;
    tiempo = 0;
    dificultad = 10;
    document.getElementById("puntos").innerHTML = `Puntos: ${puntos}`;
    document.getElementById("errores").innerHTML = `Errores: ${errores}/3`;
    document.getElementById("cronometro").innerHTML = `Tiempo: ${tiempo}s`;

    txt_menj.innerHTML = "";
    clearInterval(intervalo);
    iniciarCronometro();

    op1.onclick = () => controlarRespuesta(op1);
    op2.onclick = () => controlarRespuesta(op2);
    op3.onclick = () => controlarRespuesta(op3);

    comenzar();
}

function toggleAudio() {
    const musica = document.getElementById("musicaFondo");
    const icono = document.getElementById("icono-audio");

    if (musica.muted) {
        musica.muted = false;
        icono.src = "assets/audio-on.png";
        icono.alt = "Audio On";
    } else {
        musica.muted = true;
        icono.src = "assets/audio-off.png";
        icono.alt = "Audio Off";
    }
}

window.onload = function () {
    comenzar();
    iniciarCronometro();
};

function volverAlMenu() {
    // Reemplaza 'menu.html' con la ruta a tu pantalla anterior
    window.location.href = "../pantallaJuegos.html";
}