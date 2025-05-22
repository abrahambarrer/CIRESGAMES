const totalDisks = 6;
let moveCount = 0;
let draggedDisk = null;

function updateCounter() {
  document.getElementById('counter').textContent = `Movimientos: ${moveCount} / 63`;
}

function resetGame() {
  document.querySelectorAll('.pole').forEach(pole => pole.innerHTML = '');
  moveCount = 0;
  updateCounter();
  const pole0 = document.getElementById('pole-0');
  for (let i = totalDisks; i >= 1; i--) {
    const disk = document.createElement('div');
    disk.className = 'disk';
    disk.style.width = `${30 + i * 15}px`;
    disk.dataset.size = i;
    disk.draggable = true;
    disk.addEventListener('dragstart', onDragStart);
    pole0.appendChild(disk);
  }
  document.getElementById('overlay').classList.remove('show');
}

function onDragStart(e) {
  const pole = e.target.parentElement;
  if (pole.lastElementChild !== e.target) {
    e.preventDefault();
    return;
  }
  draggedDisk = e.target;
}

document.querySelectorAll('.pole').forEach(pole => {
  pole.addEventListener('dragover', e => e.preventDefault());
  pole.addEventListener('drop', function (e) {
    if (!draggedDisk) return;
    const topDisk = this.lastElementChild;
    if (!topDisk || +draggedDisk.dataset.size < +topDisk.dataset.size) {
      this.appendChild(draggedDisk);
      moveCount++;
      updateCounter();
      checkWin();
    }
    draggedDisk = null;
  });
});

function checkWin() {
  const pole2 = document.getElementById('pole-2');
  if (pole2.children.length === totalDisks) {
    document.getElementById('final-score').textContent = `Movimientos realizados: ${moveCount}`;
    document.getElementById('overlay').classList.add('show');
  }
}

function backToMenu() {
  window.location.href = "../pantallaJuegos.html";
}

document.getElementById('resetButton').addEventListener('click', resetGame);
document.getElementById('newGame').addEventListener('click', resetGame);

window.onload = resetGame;

window.addEventListener('load', function() {
    const volverBtn = document.getElementById('icono-volver');
    volverBtn.addEventListener('click', function() {
    window.location.href = "../pantallaJuegos.html";
  });
});