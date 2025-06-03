const { ipcRenderer } = require('electron');

// Ejecutar cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  const musicaFondo = document.getElementById('musicaFondo');
  const iconoSonido = document.getElementById('iconoSonido');
  const botonSalir = document.getElementById('botonSalir');
  const nombreInput = document.getElementById('nombreInput');
  const botonGuardar = document.getElementById('botonGuardar');
  const botonIniciar = document.getElementById('botonIniciar');
  const enlaceIniciar = document.getElementById('enlaceIniciar');

  // ====== Música de fondo ======
  if (musicaFondo && iconoSonido) {
    document.body.addEventListener('click', () => {
      musicaFondo.play();
    });

    iconoSonido.addEventListener('click', () => {
      iconoSonido.classList.toggle('sonido-activado');
      iconoSonido.classList.toggle('sonido-desactivado');
      if (musicaFondo.paused) {
        musicaFondo.play();
      } else {
        musicaFondo.pause();
      }
    });
  }

  // ====== Botón Salir ======
  if (botonSalir) {
    botonSalir.addEventListener('click', () => {
      ipcRenderer.send('cerrar-ventana');
    });
  }

  // ====== Guardar nombre e iniciar ======
  if (nombreInput && botonGuardar && botonIniciar && enlaceIniciar) {
    let nombreGuardado = false;
    botonGuardar.disabled = true;

    nombreInput.addEventListener('input', () => {
      const tieneTexto = nombreInput.value.trim().length > 0;
      botonGuardar.disabled = !tieneTexto;

      if (!tieneTexto && nombreGuardado) {
        nombreGuardado = false;
        deshabilitarIniciar();
      }
    });

    botonGuardar.addEventListener('click', () => {
      const nombre = nombreInput.value.trim();
      if (nombre.length > 0) {
        localStorage.setItem('nombreUsuario', nombre);
        nombreGuardado = true;
        habilitarIniciar();
      }
    });

    if (localStorage.getItem('nombreUsuario')) {
      nombreInput.value = localStorage.getItem('nombreUsuario');
      botonGuardar.disabled = false;
      nombreGuardado = true;
      habilitarIniciar();
    }

    function habilitarIniciar() {
      botonIniciar.classList.remove('boton-iniciar-deshabilitado');
      botonIniciar.disabled = false;
      enlaceIniciar.onclick = null;
    }

    function deshabilitarIniciar() {
      botonIniciar.classList.add('boton-iniciar-deshabilitado');
      botonIniciar.disabled = true;
      enlaceIniciar.onclick = function(e) {
        e.preventDefault();
      };
    }
  }
});