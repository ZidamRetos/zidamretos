const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const displayTile = document.getElementById("guess-tile");
const message = document.getElementById("message");
const keyboard = document.getElementById("keyboard");
const timerDisplay = document.getElementById("timer");

// --- LÓGICA DE LA LETRA DIARIA ---
function obtenerLetraDelDia() {
    const hoy = new Date();
    // Crea una semilla única basada en Año, Mes y Día
    const semilla = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate();
    const indice = semilla % letras.length;
    return letras[indice];
}

const letraCorrecta = obtenerLetraDelDia();

// --- GENERAR TECLADO ---
letras.forEach(letra => {
    const btn = document.createElement("button");
    btn.innerText = letra;
    btn.classList.add("key");
    btn.id = `key-${letra}`;
    btn.onclick = () => verificar(letra);
    keyboard.appendChild(btn);
});

// --- VERIFICACIÓN ---
function verificar(intento) {
    displayTile.innerText = intento;
    
    if (intento === letraCorrecta) {
        // GANÓ
        displayTile.classList.add("correct");
        message.innerHTML = "¡EXCELENTE! Has acertado. 🎉";
        localStorage.setItem("ganadoHoy", new Date().toDateString());
        finalizarJuego();
    } else {
        // FALLÓ
        displayTile.classList.add("wrong-anim");
        setTimeout(() => displayTile.classList.remove("wrong-anim"), 400);
        message.innerText = "Esa no es, ¡prueba otra!";
        document.getElementById(`key-${intento}`).disabled = true;
    }
}

function finalizarJuego() {
    const botones = document.querySelectorAll(".key");
    botones.forEach(b => b.disabled = true);
}

// --- TEMPORIZADOR PARA MAÑANA ---
function actualizarReloj() {
    const ahora = new Date();
    const mañana = new Date(ahora);
    mañana.setDate(mañana.getDate() + 1);
    mañana.setHours(0, 0, 0, 0);

    const diferencia = mañana - ahora;
    const horas = Math.floor(diferencia / 1000 / 60 / 60);
    const minutos = Math.floor((diferencia / 1000 / 60) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    timerDisplay.innerText = `${horas}h ${minutos}m ${segundos}s`;
}

setInterval(actualizarReloj, 1000);

// --- COMPROBAR ESTADO AL CARGAR ---
window.onload = () => {
    if (localStorage.getItem("ganadoHoy") === new Date().toDateString()) {
        displayTile.innerText = letraCorrecta;
        displayTile.classList.add("correct");
        message.innerText = "Ya jugaste por hoy. ¡Vuelve mañana!";
        finalizarJuego();
    }
    actualizarReloj();
};