document.addEventListener('DOMContentLoaded', function() {
    // Control de sonido
    const iconoSonido = document.getElementById('iconoSonido');
    if (iconoSonido) {
        iconoSonido.addEventListener('click', function() {
            this.classList.toggle('sonido-activado');
            this.classList.toggle('sonido-desactivado');
            // Aquí podrías añadir lógica para controlar el audio
        });
    }
    
    // Navegación
    const btnRegresar = document.getElementById('btnRegresar');
    if (btnRegresar) {
        btnRegresar.addEventListener('click', function() {
            window.location.href = '../pantallaInicio.html';
        });
    }
    
    // Navegación desde el icono de volver
    const iconoVolver = document.querySelector('.icono-volver');
    if (iconoVolver) {
        iconoVolver.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = this.getAttribute('href');
        });
    }
});