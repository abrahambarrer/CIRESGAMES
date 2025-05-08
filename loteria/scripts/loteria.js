let game;
let soundButton;
let soundCard;
let boton;
let cardAssets = [];

function preload() {
  // Cargar sonidos antes de iniciar
  soundButton = loadSound('sounds/toy-button.mp3');
  soundCard = loadSound('sounds/card.mp3');

  const names = [
    'arquimedes','bell','curie','dalton','darwin','daVinci',
    'descartes','edison','einstein','erwin','fleming','galileo',
    'hawking','mendel','mendeleyev','newton','nicolas','pasteur',
    'pitagoras','tesla'
  ];

  names.forEach(name => {
    const frontImg   = loadImage(`assets/${name}_anverso.png`);
    const backImg    = loadImage(`assets/${name}_reverso.png`);
    const frontSound = loadSound(`sounds/anverso/${name}_anverso.mp3`);
    const backSound  = loadSound(`sounds/reverso/${name}_reverso.mp3`);

    cardAssets.push({
      frontImg,
      backImg,
      frontSound,
      backSound
    });
  });
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  document.getElementById('loader').style.display = 'none';
  document.getElementById('canvas-container').style.display = 'block';

  boton = new MainButton('<', cambiarPagina);
  boton.setPosition(width / 50, height / 50);
  boton.setPadding(1, 2);
  
  imageMode(CENTER);
  angleMode(RADIANS);
  game = new Game(cardAssets);
}

function cambiarPagina() {
  window.location.href = '../pantallaJuegos.html';
}

function draw() {
  background(220);
  game.display();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  game.onResize();
}

function mousePressed() {
  game.mousePressed(mouseX, mouseY);
}

class Game {
  constructor(assets) {
    this.pairs = assets.map(a => 
      new CardPair(a.frontImg, a.backImg, a.frontSound, a.backSound)
    );
    shuffle(this.pairs, true);
    this.currentIndex = 0;
    this.animation = null;
    //this._loadPairs();
    this.nextButton = new MainButton('Siguiente>', () => this.startAnimation());
    this.onResize();
    this.reversoPlaying = false;
    this.reverseAnimStart = 0;
  }

  startAnimation() {
    if (this.animation) return;
    // Reproducir sonido de botón
    if (soundButton && !soundButton.isPlaying()) soundButton.play();

    this.nextButton.disable(); // Evitar clics durante animación

    const nextIdx = (this.currentIndex + 1) % this.pairs.length;
    this.animation = new Transition(
      this.pairs[this.currentIndex],
      this.pairs[nextIdx]
    );
    this.animation.start();
  }

  display() {
    if (this.animation) {
      this.animation.update();
      this.animation.display();
      if (this.animation.finished) {
        this.currentIndex = (this.currentIndex + 1) % this.pairs.length;
        this.animation = null;
      
        // Solo reproducir el anverso
        const current = this.pairs[this.currentIndex];
        if (current.frontSound && current.frontSound.isLoaded()) {
          this.nextButton.disable();
          current.frontSound.play();
          current.frontSound.onended(() => {
            this.nextButton.enable();
          });
        } else {
          this.nextButton.enable();
        }
      }
    } else {
      const pair = this.pairs[this.currentIndex];

      if (this.reversoPlaying) {
        // parámetros de la carta
        const cx = width / 2 - pair.w / 2 - 50;
        const cy = height / 2 - pair.h * 0.1;
        
        // cálculo del pulso: oscila cada 500 ms entre escala 1.0 y 1.1
        const elapsed = (millis() - this.reverseAnimStart) % 500;
        const pulse  = 1 + 0.05 * sin(TWO_PI * elapsed / 500);

        // dibujar reverso con escala
        push();
          translate(cx, cy);
          scale(pulse);
          image(pair.back, 0, 0, pair.w, pair.h);
        pop();

        // dibujar el anverso normalmente
        imageMode(CENTER);
        image(pair.front, width/2 + pair.w/2 + 50,
                    height/2 - pair.h * 0.1,
                    pair.w, pair.h);
      } else {
        // sin animación, muestra ambas cartas
        pair.display();
      }
    }
  }

  onResize() {
    const maxW = windowWidth * 0.6;
    const maxH = windowHeight * 0.6;
    this.pairs.forEach(p => p.setSize(maxW, maxH));

    const btnW = windowWidth * 0.3;
    const btnH = windowHeight * 0.08;
    const cx = windowWidth / 2;
    const topY = windowHeight / 2 - maxH / 2;
    this.nextButton.setSize(btnW, btnH);
    this.nextButton.setPosition(cx - btnW / 2, topY + maxH + 20);
  }

  mousePressed(mx, my) {
    if (this.animation) return;
  
    const current = this.pairs[this.currentIndex];
    if (current.isOverReverso(mx, my) && !this.reversoPlaying) {
      if (current.backSound && current.backSound.isLoaded()) {
        this.reversoPlaying = true;
        this.nextButton.disable(); // Desactivar botón durante audio
        this.reverseAnimStart = millis();

        this.reversoPlaying  = true;
        this.nextButton.disable();
        current.backSound.play();
        current.backSound.onended(() => {
          this.reversoPlaying = false;
          this.nextButton.enable();
        });

        current.backSound.play();
        current.backSound.onended(() => {
          this.reversoPlaying = false;
          this.nextButton.enable(); // Reactivar botón después del audio
        });
      }
    }
  }
}

class CardPair {
  constructor(frontImg, backImg, frontSound, backSound) {
    this.front      = frontImg;
    this.back       = backImg;
    this.frontSound = frontSound;
    this.backSound  = backSound;
    this.w = 100;
    this.h = 150;
  }

  setSize(maxW, maxH) {
    const ar = this.front.width / this.front.height;
    let w = maxW;
    let h = w / ar;
    if (h > maxH) {
      h = maxH;
      w = h * ar;
    }
    this.w = w;
    this.h = h;
  }

  display() {
    const cx = width / 2;
    const cy = height / 2 - this.h * 0.1;
    const sp = 50;
    image(this.back, cx - this.w / 2 - sp, cy, this.w, this.h);
    image(this.front, cx + this.w / 2 + sp, cy, this.w, this.h);
  }

  isOverReverso(mx, my) {
    const cx_total = width / 2; 
    const cy = height / 2 - this.h * 0.1;
    const sp = 50;
  
    // Centro real de la carta reverso
    const centerX = cx_total - this.w / 2 - sp;
    const centerY = cy;
  
    // Comprobar si el clic está dentro de la caja w×h alrededor de ese centro
    return (
      mx >= centerX - this.w / 2 &&
      mx <= centerX + this.w / 2 &&
      my >= centerY - this.h / 2 &&
      my <= centerY + this.h / 2
    );
  }
  
}

class Transition {
  constructor(oldPair, newPair) {
    this.old = oldPair;
    this.next = newPair;
    this.duration = 500;
    this.startTime = 0;
    this.finished = false;
    this.soundPlayed = false;
  }

  start() {
    this.startTime = millis();
  }

  update() {
    let t = (millis() - this.startTime) / this.duration;
    if (t >= 1) { t = 1; this.finished = true; }
    this.progress = constrain(t, 0, 1);

    if (!this.soundPlayed && this.progress > 0) {
      if (soundCard && !soundCard.isPlaying()) soundCard.play();
      this.soundPlayed = true;
    }
  }

  display() {
    const cx = width / 2;
    const baseY = height / 2 - this.old.h * 0.1;
    const sp = 50;
    const p = this.progress;

    // Izquierda: shrink -> grow
    if (p < 0.5) {
      const s = map(p, 0, 0.5, 1, 0);
      push(); translate(cx - this.old.w / 2 - sp, baseY); scale(s);
      image(this.old.back, 0, 0, this.old.w, this.old.h);
      pop();
    } else {
      const s = map(p, 0.5, 1, 0, 1);
      push(); translate(cx - this.next.w / 2 - sp, baseY); scale(s);
      image(this.next.back, 0, 0, this.next.w, this.next.h);
      pop();
    }

    // Derecha: throwing effect
    image(this.old.front, cx + this.old.w / 2 + sp, baseY, this.old.w, this.old.h);
    const startX = width + this.next.w / 2;
    const endX = cx + this.next.w / 2 + sp;
    const e = 1 - sq(1 - p);
    const x = lerp(startX, endX, e);
    const y = baseY - sin(p * PI) * 100;
    const angle = map(p, 0, 1, PI / 4, 0);
    push(); translate(x, y); rotate(-angle);
    image(this.next.front, 0, 0, this.next.w, this.next.h);
    pop();
  }
}

class MainButton {
  constructor(label, onClick, sound = null) {
    this.enabled = true; // Estado del botón
    this.sound = sound;
    this.onClick = onClick;

    this.button = createButton(label);
    this.button.mousePressed(() => {
      if (!this.enabled) return; // Si está deshabilitado, no hace nada
      if (this.sound) this.sound.play();
      this.onClick();
    });
    this._applyStyles();
  }

  disable() {
    this.enabled = false;
    this.button.style('opacity', '0.5');
    this.button.style('pointer-events', 'none');
  }

  enable() {
    this.enabled = true;
    this.button.style('opacity', '1');
    this.button.style('pointer-events', 'auto');
  }

  _applyStyles() {
    this.button.addClass('btn-main');
  }

  setPosition(x, y) {
    this.button.position(x, y);
  }

  setPadding(vertical, horizontal) {
    this.button.style('padding', `${vertical}rem ${horizontal}rem`);
  }

  positionAbsolute() {
    this.button.class('btn-main-centered');
  }

  setSize(w, h) {
    this.button.style('width', `${w}px`);
    this.button.style('height', `${h}px`);
    this.button.style('font-size', `${h * 0.5}px`);
  }
}