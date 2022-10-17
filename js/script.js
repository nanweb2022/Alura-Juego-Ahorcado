var startGame = document.getElementById("startGame");
var addWord = document.getElementById("addWord");
var saveStart = document.getElementById("saveStart");
var cancel = document.getElementById("cancel");
var cancel2 = document.getElementById("cancel2");
var nuevoJuego = document.getElementById("nuevoJuego");

/*Input oculto autofocus */
var inputOculto = document.getElementById("input-oculto");
var addWords = document.getElementById("addWords");

/*Contenedores */
var botonesPrincipal = document.getElementsByClassName("contenedor-botonesPrincipal");
var contenedorPalabras = document.getElementsByClassName("contenedor-agregarPalabras");
var contenedorGame = document.getElementsByClassName("contenedor-Game");
var wrongLetter = document.getElementsByClassName("contenedor-letrasincorrectas");
var scriptContent = document.getElementById("contenedor-guiones");
var guiones = document.getElementsByClassName("line");
var letter = document.getElementsByClassName("letter");

// Modal
var modal = document.getElementById("myModal");
var modalContent = document.getElementsByClassName("modal-content");



/*Variables del juego */
var ctx = canvas.getContext("2d");
var palabraSecreta = "";
var secretWords = ["perro", "casa", "carro", "alura"];
var letrasIncorrectas = "";
var contadorErrores = 0;





function newGame() {
    modal.style.display = "none";
    addWords.blur();
    createSecretWord();

    setTimeout(function () {
        inicializarCanvas();
        addEventListener("resize", inicializarCanvas);
    }, 15);

    drawLines(palabraSecreta.length, scriptContent, "line");

    //Evento input en un input para obtener el valor de la tecla presionada
    inputOculto.oninput = (e) => {
        let letra = e.target.value.toUpperCase(); //Pasar la letra presionada a mayuscula
        let codigoAscii = letra.charCodeAt(0); //obtener el codigo ascii de la letra
        drawLetterAndCanvas(codigoAscii, letra); //enviar datos a la función
        /*borrar el contenido del input */
        inputOculto.value = "";
    }

    //Evento keydown para pcs
    document.onkeydown = (e) => {
        let letra = e.key.toUpperCase();
        let code = e.keyCode;
        drawLetterAndCanvas(code, letra);

    }

}

function createSecretWord() {
    var numbRandom = Math.round(Math.random() * (secretWords.length - 1));
    console.log(secretWords[numbRandom] + " " + numbRandom);

    /*Palabra elegida aleatoriamente*/
    palabraSecreta = secretWords[numbRandom].toUpperCase();

    /*Elementos de la pantalla */
    botonesPrincipal[0].style.display = "none";
    contenedorGame[0].style.display = "flex";
    inputOculto.focus();
}

function drawLines(number, content, className) {
    content.innerHTML = "";

    for (var i = 0; i < number; i++) {
        var divs = document.createElement("div");
        divs.id = i;
        divs.className = className
        content.appendChild(divs);
    }
}

//Funcion para verificar si la tecla es letra y no caracter
function keyDown(code) {
    if ((code >= 65 && code <= 90) || code == 192) {
        return true;
    } else {
        return false;
    }
}

function drawLetterAndCanvas(code, letra) {
    if (keyDown(code) && palabraSecreta.includes(letra)) {
        var espaciosLlenos = [];
        for (let i = 0; i < palabraSecreta.length; i++) {
            /*Draw letter on the line*/
            if (palabraSecreta[i] === letra) {
                guiones[i].innerHTML = letra.toUpperCase();
            }
            if (guiones[i].innerHTML != "") {
                espaciosLlenos.push(i);
                if (espaciosLlenos.length == palabraSecreta.length) {
                    modal.style.display = "block";
                    let etiqueta = document.getElementsByClassName("gameOver")[0];
                    etiqueta.textContent = "";
                    var salto = document.getElementsByClassName("palabraCorrecta")[0];
                    salto.textContent = "Felicidades, Has ganado";
                    salto.style.color = "green"
                    //Iniciar Nuevo Juego luego de cometer 8 errores
                    contadorErrores = 0;
                    letrasIncorrectas = ""
                    letter[0].innerHTML = letrasIncorrectas;
                }
            }
        }


    } else if (keyDown(code)) {
        /* Se verifica si la letra incorrecta ya ha sido presionada */
        if (letrasIncorrectas.includes(letra.toUpperCase())) {
            letter[0].innerHTML = letrasIncorrectas;
        } else {
            contadorErrores++;
            if (contadorErrores == 8) {
                modal.style.display = "block";
                let etiqueta = document.getElementsByClassName("gameOver")[0];
                var salto = document.getElementsByClassName("palabraCorrecta")[0];
                etiqueta.textContent = "GAME OVER";
                salto.textContent = "Palabra correcta: " + palabraSecreta;
                salto.style.color = "red"
                //Iniciar Nuevo Juego luego de cometer 8 errores
                contadorErrores = 0;
                letrasIncorrectas = ""
                letter[0].innerHTML = letrasIncorrectas;
            } else {
                dibujarAhorcado(contadorErrores);
                letrasIncorrectas += letra.toUpperCase();
                letter[0].innerHTML = letrasIncorrectas;
            }
        }
    }
}

function newWords() {
    addWords.focus();
    contenedorPalabras[0].style.display = "flex";
    botonesPrincipal[0].style.display = "none";
}

function addNewWords() {
    var bandera = false;
    var nuevasPalabras = addWords.value.toUpperCase();
    if (nuevasPalabras == "") {
        alert("Campo vacio, por favor ingrese una palabra");
    } else {
        if (nuevasPalabras.length > 7) {
            alert("La palabra sobrepasa los 8 caracteres");
            addWords.value = "";
        } else {
            for (let i = 0; i < nuevasPalabras.length; i++) {
                let code = nuevasPalabras.charCodeAt(i);
                if (!keyDown(code)) {
                    alert("La palabra solo debe de contener letras A-Z");
                    addWords.value = "";
                    bandera = true;
                    break;
                }
            }
            if (!bandera) {
                addWords.value = "";
                secretWords.push(nuevasPalabras.toLowerCase());
                contenedorPalabras[0].style.display = "none";
                contenedorGame[0].style.display = "flex";
                console.log(secretWords);
                newGame()
            }
        }
    }

}

function cancelAddWords() {
    document.onkeydown = (e) => {
        e.stopPropagation();
    }
    addWords.blur();
    inputOculto.blur();
    palabraSecreta = "";
    contadorErrores = 0;
    letrasIncorrectas = "";
    modal.style.display = "none";
    contenedorGame[0].style.display = "none";
    contenedorPalabras[0].style.display = "none";
    botonesPrincipal[0].style.display = "flex";
}

startGame.addEventListener("click", newGame);
nuevoJuego.addEventListener("click", newGame);
addWord.addEventListener("click", newWords);
saveStart.addEventListener("click", addNewWords);
cancel.addEventListener("click", cancelAddWords);
cancel2.addEventListener("click", cancelAddWords);
year.innerText = yearActual();