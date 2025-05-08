let particula;
let canasta;
let controlAngulo, controlPotencia;
let mostrarAngulo, mostrarPotencia;
let estaLanzada = false;
let velocidadParpadeo = 0.1;
let contadorParpadeosColor = 0;
let puntuacion = 0;
let mensajeFin = null;
let sonidoActivado = true;
let sonidoDisparo, sonidoCanasta;

function setup() {
  let lienzo = createCanvas(windowWidth, windowHeight);
  lienzo.parent('gameCanvas');
  
  particula = {
    x: 100,
    y: height - 100,
    r: 15,
    vx: 0,
    vy: 0,
    gravedad: 0.2,
    baseX: 100,
    baseY: height - 100
  };
  
  reiniciarPosicionCanasta();
  
  controlAngulo = createSlider(0, 90, 45);
  controlAngulo.position(100, 20);
  controlAngulo.style('width', '150px');
  
  controlPotencia = createSlider(5, 20, 10);
  controlPotencia.position(100, 50);
  controlPotencia.style('width', '150px');
  
  mostrarAngulo = createP(controlAngulo.value() + "°");
  mostrarAngulo.position(controlAngulo.x + controlAngulo.width + 10, controlAngulo.y - 15);
  mostrarAngulo.style('color', '#333');
  
  mostrarPotencia = createP(controlPotencia.value());
  mostrarPotencia.position(controlPotencia.x + controlPotencia.width + 10, controlPotencia.y - 15);
  mostrarPotencia.style('color', '#333');
  
  let botonLanzar = createButton("Dispara");
  botonLanzar.position(30, 80);
  botonLanzar.mousePressed(lanzarParticula);
  botonLanzar.style('padding', '8px 15px');
  botonLanzar.style('background', '#4CAF50');
  botonLanzar.style('color', 'white');
  
  document.getElementById('btnSonido').addEventListener('click', function() {
    sonidoActivado = !sonidoActivado;
    this.classList.toggle('sonido-on');
    this.classList.toggle('sonido-off');
    
    if (sonidoActivado) {
      sonidoDisparo.setVolume(0.7);
      sonidoCanasta.setVolume(0.7);
    } else {
      sonidoDisparo.setVolume(0);
      sonidoCanasta.setVolume(0);
    }
  });
}

function reiniciarPosicionCanasta() {
  canasta = {
    x: random(width * 0.5, width * 0.8),
    y: random(height * 0.4, height * 0.6),
    w: 60,
    alturaRed: 70
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  particula.y = height - 100;
  particula.baseY = height - 100;
  reiniciarPosicionCanasta();
}

function draw() {
  background(240);

  let angulo = radians(controlAngulo.value());
  let longitudCanon = 60;
  
  // Cañón
  fill(100);
  push();
  translate(50, height - 50);
  rotate(-angulo);
  rect(0, -5, longitudCanon, 10);
  fill(150);
  ellipse(longitudCanon, 0, 15, 15);
  pop();

  if (!estaLanzada) {
    particula.x = 50 + longitudCanon * cos(angulo);
    particula.y = (height - 50) - longitudCanon * sin(angulo);
  }


  contadorParpadeosColor += velocidadParpadeo;
  let colorParpadeo = color(
    255 * abs(sin(contadorParpadeosColor)),
    150 * abs(sin(contadorParpadeosColor + PI/3)),
    100 * abs(sin(contadorParpadeosColor + 2*PI/3))
  );
  fill(colorParpadeo);
  noStroke();
  ellipse(particula.x, particula.y, particula.r * 2);
  
  if (estaLanzada && frameCount % 6 < 2) {
    fill(255, 255, 255, 150);
    ellipse(particula.x, particula.y, particula.r * 2.5);
  }
  
  dibujarCanasta();
  
  
  if (estaLanzada) {
    particula.x += particula.vx;
    particula.y += particula.vy;
    particula.vy += particula.gravedad;
    
    if (particula.y + particula.r > height) {
      reiniciarParticula();
    }
    
   if (
      dist(particula.x, particula.y, 
           canasta.x + canasta.w/2, canasta.y) < particula.r + canasta.w/2 &&
      particula.y < canasta.y + 10 &&
      particula.vy > 0
    ) {
      mostrarmensajeFin();
      reiniciarParticula();
      reiniciarPosicionCanasta();
    }
  }
  
  mostrarAngulo.html(controlAngulo.value() + "°");
  mostrarPotencia.html(controlPotencia.value());
  
  fill(100);
  textSize(20);
  text("Ángulo:", controlAngulo.x - 70, controlAngulo.y + 15);
  text("Fuerza:", controlPotencia.x - 70, controlPotencia.y + 15);
  
  if (mensajeFin) {
    mensajeFin.show();
    if (frameCount % 60 === 0) {
      mensajeFin.remove();
      mensajeFin = null;
    }
  }
}

function dibujarCanasta() {
  const centroAroX = canasta.x;
  const centroAroY = canasta.y;
  const anchoTablero = 140;
  const altoTablero = 8;
  
  // Soporte vertical
  fill(255, 165, 0);
  noStroke();
  rect(centroAroX - 15, centroAroY - 180, 30, 150);
  
  let colorTablero = drawingContext.createLinearGradient(
    centroAroX - anchoTablero/2, centroAroY - 30,
    centroAroX + anchoTablero/2, centroAroY - 30
  );

  colorTablero.addColorStop(0, '#FFA500');
  colorTablero.addColorStop(1, '#FF8C00');
  drawingContext.fillStyle = colorTablero;
  rect(centroAroX - anchoTablero/2, centroAroY - 40, anchoTablero, altoTablero);

  fill(255, 40, 40);
  stroke(180, 0, 0);
  strokeWeight(2);
  ellipse(centroAroX, centroAroY, canasta.w + 8, 16);
  
  noFill();
  stroke(255, 100, 100, 150);
  strokeWeight(3);
  ellipse(centroAroX, centroAroY, canasta.w, 12);

  noFill();
  strokeWeight(0.8);
  const inicioRedY = centroAroY + 2;
  const finRedY = centroAroY + canasta.alturaRed;
  const anchoRed = canasta.w * 0.9;

  for(let x = centroAroX - anchoRed/2 + 2; x <= centroAroX + anchoRed/2 - 2; x += 4) {
    stroke(255, 180, 180, 200);
    line(x, inicioRedY, centroAroX, finRedY);
    stroke(255, 220, 220, 80);
    line(x + 1.5, inicioRedY + 3, centroAroX, finRedY - 8);
  }

  for(let y = inicioRedY; y < finRedY; y += 6) {
    let onda = sin(y * 0.3) * 3;
    let anchoActual = map(y, inicioRedY, finRedY, anchoRed, anchoRed * 0.3);
    
    beginShape();
    vertex(centroAroX - anchoActual/2 + onda, y);
    for(let x = centroAroX - anchoActual/2; x <= centroAroX + anchoActual/2; x += 8) {
      let xOnda = x + sin(y * 0.5 + x * 0.2) * 2;
      vertex(xOnda, y + abs(x - centroAroX) * 0.1);
    }
    vertex(centroAroX + anchoActual/2 + onda, y);
    endShape();
  }

  fill(200);
  noStroke();
  rect(centroAroX - 4, centroAroY - 40, 8, 40);
}

function mostrarmensajeFin() {
  mensajeFin = createP("¡Ganaste!");
  mensajeFin.position(width/2 - 50, height/2 - 50);
  mensajeFin.style('color', 'green');
  mensajeFin.style('font-size', '48px');
  mensajeFin.style('font-weight', 'bold');
  mensajeFin.hide();
}

function lanzarParticula() {
  if (!estaLanzada) {
    let anguloRad = radians(controlAngulo.value());
    particula.vx = cos(anguloRad) * controlPotencia.value();
    particula.vy = -sin(anguloRad) * controlPotencia.value();
    estaLanzada = true;
  }
}

function reiniciarParticula() {
  particula.x = 100;
  particula.y = height - 100;
  particula.vx = 0;
  particula.vy = 0;
  estaLanzada = false;
}