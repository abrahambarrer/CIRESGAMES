let anverso;
let reversoImagenes = [];
let partida;
let tiempoInicio;
let tiempoActual;
let pressStart2P;
let flipSound;
let matchSound;
let musicaFondo;
let confettiColor = [];
let confetti = [];
let boton;
let tiempoFin;   

function preload() {
  pressStart2P = loadFont('fonts/PressStart2P-Regular.ttf');

  anverso = loadImage("assets/anverso.png");
  reversoImagenes.push(loadImage("assets/cilindro.png"));
  reversoImagenes.push(loadImage("assets/circulo.png"));
  // reversoImagenes.push(loadImage("assets/cono.png"));
  // reversoImagenes.push(loadImage("assets/cruz.png"));
  // reversoImagenes.push(loadImage("assets/cuadrado.png"));
  // reversoImagenes.push(loadImage("assets/cubo.png"));
  // reversoImagenes.push(loadImage("assets/cuerposGeometricos.png"));
  // reversoImagenes.push(loadImage("assets/dodecaedro.png"));
  // reversoImagenes.push(loadImage("assets/esfera.png"));
  // reversoImagenes.push(loadImage("assets/estrella.png"));
  // reversoImagenes.push(loadImage("assets/figurasPlanas.png"));
  // reversoImagenes.push(loadImage("assets/hexagono.png"));
  // reversoImagenes.push(loadImage("assets/juegoGeometrico.png"));
  // reversoImagenes.push(loadImage("assets/lineasCurvas.png"));
  // reversoImagenes.push(loadImage("assets/lineasParalelas.png"));
  // reversoImagenes.push(loadImage("assets/octaedro.png"));
  // reversoImagenes.push(loadImage("assets/ovalo.png"));
  // reversoImagenes.push(loadImage("assets/paralelepipedo.png"));
  // reversoImagenes.push(loadImage("assets/pentagono.png"));
  // reversoImagenes.push(loadImage("assets/piramideCuadrangular.png"));
  // reversoImagenes.push(loadImage("assets/piramideHexagonal.png"));
  // reversoImagenes.push(loadImage("assets/piramideTriangular.png"));
  // reversoImagenes.push(loadImage("assets/prismaTriangular.png"));
  // reversoImagenes.push(loadImage("assets/rectangulo.png"));
  // reversoImagenes.push(loadImage("assets/rombo.png"));
  // reversoImagenes.push(loadImage("assets/trapecio.png"));
  // reversoImagenes.push(loadImage("assets/trapezoide.png"));
  // reversoImagenes.push(loadImage("assets/triangulo.png"));

  sonidoVoltear = loadSound('sounds/cardFlip.mp3');
  sonidoMatch = loadSound('sounds/match.wav');
  musicaFondo = loadSound('sounds/love-8-bit.mp3');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  document.getElementById('loader').style.display = 'none';
  document.getElementById('canvas-container').style.display = 'block';
  
  partida = new Partida(2, 2, anverso, reversoImagenes);
  tiempoInicio = millis(); 
  musicaFondo.setVolume(0.2); 
  musicaFondo.loop(); 

  confettiColor = [color('#00aeef'), color('#ec008c'), color('#72c8b6')];
  for (let i = 0; i < 100; i++) {
    confetti[i] = new Confetti(random(0, width), random(-height, 0), random(-1, 1));
  }
}

function draw() {
  background(220);
  partida.colocarCartas();

  // Calcular tiempo transcurrido
  if (!partida.terminada && partida.numeroMatches === partida.filas * partida.columnas / 2) {
    partida.terminada = true;
    tiempoFin = millis();
    guardarRankingMemorama();
  }

  // Calcular tiempo: si ya terminó, usar tiempoFin
  if (!partida.terminada) {
    tiempoActual = millis() - tiempoInicio;
  } else {
    tiempoActual = tiempoFin - tiempoInicio;
  }

  let segundosTotales = int(tiempoActual / 1000);
  let minutos = floor(segundosTotales / 60);
  let segundos = segundosTotales % 60;

  let tiempoTexto = nf(minutos, 2) + ':' + nf(segundos, 2);
  let paresTexto = "Intentos: " + partida.paresRevelados;
  // Dibujar cronómetro en esquina superior izquierda
  fill(0);
  textSize(20);
  textFont(pressStart2P);
  textAlign(RIGHT, TOP);
  text(tiempoTexto, width - 20, 20);
  text(paresTexto, width - 20, 80);

  if (partida.numeroMatches === partida.filas * partida.columnas / 2){
    mostrarConfetti();
  }
}

function mostrarConfetti() {
  for (let i = 0; i < confetti.length / 2; i++) {
    confetti[i].confettiDisplay();

    if (confetti[i].y > height) {
      confetti[i] = new Confetti(random(0, width), random(-height, 0), random(-1, 1));
    }
  }

  for (let i = int(confetti.length / 2); i < confetti.length; i++) {
    confetti[i].confettiDisplay();

    if (confetti[i].y > height) {
      confetti[i] = new Confetti(random(0, width), random(-height, 0), random(-1, 1));
    }
  }
}

window.addEventListener('load', function() {
    const volverBtn = document.getElementById('icono-volver');
    volverBtn.addEventListener('click', function() {
    window.location.href = "../pantallaJuegos.html";
  });
});

function mousePressed() {
  partida.mousePressed(mouseX, mouseY);
}

class Carta {
  constructor(x, y, tamanio, cartaID, anverso, reverso) {
    this.x = x;
    this.y = y;
    this.tamanio = tamanio;
    this.cartaID = cartaID;
    this.anverso = anverso;
    this.reverso = reverso;

    this.revelada = false;
    this.matched = false;

    this.escala = 1;

    this.animando = false;
    this.angulo = 0;
    this.volteandoHacia = null;

    this.opacity = 255;
    this.escalaDesaparecer = 1; 
    this.animandoDesaparecer = false; 
  }

  show() {
    let hovering = this.underMouse(mouseX, mouseY);
    let escalaHoverObjetivo = hovering ? 1.1 : 1;
    this.escala = lerp(this.escala, escalaHoverObjetivo, 0.1);
  
    if (this.animando) {
      this.angulo += 0.15;
      if (this.angulo >= PI) {
        this.angulo = 0;
        this.animando = false;
        this.revelada = this.volteandoHacia;
      }
    }
  
    if (this.animandoDesaparecer) {
      this.opacity = lerp(this.opacity, 0, 0.1);
      this.escalaDesaparecer = lerp(this.escalaDesaparecer, 0, 0.1);
  
      if (this.opacity < 1 && this.escalaDesaparecer < 0.01) {
        this.opacity = 0;
        this.escalaDesaparecer = 0;
        this.animandoDesaparecer = false;
        this.matched = true;
      }
    }
  
    if (this.opacity <= 0) return;
  
    let escalaX = cos(this.angulo);
    let mostrandoReverso = (this.animando && escalaX < 0) ? !this.revelada : this.revelada;
    let imagen = (mostrandoReverso || this.matched) ? this.reverso : this.anverso;
  
    push();
    translate(this.x + this.tamanio / 2, this.y + this.tamanio / 2);
    scale(this.escala * this.escalaDesaparecer, this.escala * this.escalaDesaparecer);
    imageMode(CENTER);
    tint(255, this.opacity);
    push();
    scale(Math.abs(escalaX), 1);
    image(imagen, 0, 0, this.tamanio, this.tamanio);
    pop();
    pop();
  }
  

  underMouse(mousex, mousey) {
    const limiteIzquierdo = this.x;
    const limiteDerecho = this.x + this.tamanio;
    const limiteSuperior = this.y;
    const limiteInferior = this.y + this.tamanio;
    return mousex >= limiteIzquierdo && mousex <= limiteDerecho &&
            mousey >= limiteSuperior && mousey <= limiteInferior;
  }

  voltear() {
    if (this.animando) return;

    this.animando = true;
    this.volteandoHacia = !this.revelada;
    this.angulo = 0;

    if (sonidoVoltear && !this.revelada) {
      sonidoVoltear.play();
    }
  }

  iniciarDesaparicion() {
    this.animandoDesaparecer = true;
  }
}

class Partida {
  constructor(filas, columnas, imagenAnverso, imagenesReverso) {
    this.filas = filas;
    this.columnas = columnas;
    this.imagenAnverso = imagenAnverso;
    this.imagenesReverso = imagenesReverso;
    this.paresRevelados = 0;
    this.numeroMatches = 0;
    this.terminada = false; 


    this.cartas = [];
    this.primeraCarta = null;
    this.locked = false;

    this.calcularTamanioYPosiciones();
    this.generarCartas();
  }

  calcularTamanioYPosiciones() {
    // Margen entre cartas
    this.espaciado = 10;

    // Calcular tamaño de carta
    let anchoDisponible = width - (this.columnas + 1) * this.espaciado;
    let altoDisponible = height - (this.filas + 1) * this.espaciado;

    this.tamanioCarta = min(
      anchoDisponible / this.columnas,
      altoDisponible / this.filas
    );

    // Calcular tamaño total del grid
    let anchoTotal = this.columnas * this.tamanioCarta + (this.columnas - 1) * this.espaciado;
    let altoTotal = this.filas * this.tamanioCarta + (this.filas - 1) * this.espaciado;

    // Coordenadas de inicio (centrado)
    this.offsetX = (width - anchoTotal) / 2;
    this.offsetY = (height - altoTotal) / 2;
  }

  generarCartas() {
    const totalCartas = this.filas * this.columnas;
    let pares = [];

    for (let i = 0; i < totalCartas / 2; i++) {
      let imagen = this.imagenesReverso[i];
      pares.push({ id: i, img: imagen });
      pares.push({ id: i, img: imagen });
    }
    pares = shuffle(pares);

    let indice = 0;
    for (let fila = 0; fila < this.filas; fila++) {
      for (let col = 0; col < this.columnas; col++) {
        let x = this.offsetX + col * (this.tamanioCarta + this.espaciado);
        let y = this.offsetY + fila * (this.tamanioCarta + this.espaciado);

        let par = pares[indice];
        let carta = new Carta(
          x,
          y,
          this.tamanioCarta,
          par.id,
          this.imagenAnverso,
          par.img
        );

        this.cartas.push(carta);
        indice++;
      }
    }
  }

  colocarCartas() {
    for (let carta of this.cartas) {
      carta.show();
    }
  }

  mousePressed(mousex, mousey) {
    if (this.locked) return;
    for (let carta of this.cartas){
      if (carta.underMouse(mouseX, mouseY) && !carta.revelada && !carta.matched){
        carta.voltear();

        if (this.primeraCarta == null) {
          this.primeraCarta = carta;
        } else {
          this.locked = true;
          this.paresRevelados++; 
          this.comprobarMatch(carta);
        }        
        break;
      }
    }
  }

  comprobarMatch(segundaCarta) {
    setTimeout(() => {
      if (segundaCarta.cartaID === this.primeraCarta.cartaID) {
        segundaCarta.iniciarDesaparicion();
        this.primeraCarta.iniciarDesaparicion();
        this.numeroMatches++;
        if (sonidoMatch) {
          sonidoMatch.play();
        }
      } else {
        segundaCarta.voltear();
        this.primeraCarta.voltear();
      }
      this.primeraCarta = null;
      this.locked = false;
    }, 1000)
  }
}

class Confetti {
  constructor(_x, _y, _s) {
    this.x = _x;
    this.y = _y;
    this.speed = _s;
    this.time = random(0, 100);
    this.color = random(confettiColor);
    this.amp = random(2, 30);
    this.phase = random(0.5, 2);
    this.size = random(width / 25, height / 50);
    this.form = round(random(0, 1));
  }

  confettiDisplay() {
    fill(this.color);
    // blendMode(SCREEN);
    noStroke();
    push();
    translate(this.x, this.y);
    translate(this.amp * sin(this.time * this.phase), this.speed * cos(2 * this.time * this.phase));
    rotate(this.time);
    rectMode(CENTER);
    scale(cos(this.time / 4), sin(this.time / 4));
    if (this.form === 0) {
      rect(0, 0, this.size, this.size / 2);
    } else {
      ellipse(0, 0, this.size);
    }
    pop();

    this.time = this.time + 0.1;

    this.speed += 1 / 200;

    this.y += this.speed;
  }
}

function guardarRankingMemorama() {
    const nombreJugador = localStorage.getItem('nombreUsuario') || 'Anónimo';
    let ranking = JSON.parse(localStorage.getItem('rankingMemorama')) || [];

    const nuevaPuntuacion = {
        nombre: nombreJugador,
        intentos: partida.paresRevelados,
        tiempo: tiempoFin
    };

    const indiceExistente = ranking.findIndex(item => item.nombre === nombreJugador);

    if (indiceExistente !== -1) {
        // Reemplazar solo si tiene menos intentos o igual intentos y mejor tiempo
        const existente = ranking[indiceExistente];
        if (
            nuevaPuntuacion.intentos < existente.intentos ||
            (nuevaPuntuacion.intentos === existente.intentos && nuevaPuntuacion.tiempo < existente.tiempo)
        ) {
            ranking[indiceExistente] = nuevaPuntuacion;
        }
    } else {
        ranking.push(nuevaPuntuacion);
    }

    // Ordenar por intentos (ascendente), luego tiempo (ascendente)
    ranking.sort((a, b) => a.intentos - b.intentos || a.tiempo - b.tiempo);

    // Guardar solo los 3 mejores
    ranking = ranking.slice(0, 3);

    // Guardar en localStorage
    localStorage.setItem('rankingMemorama', JSON.stringify(ranking));
}
