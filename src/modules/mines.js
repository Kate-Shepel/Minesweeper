export let mineLocations;
let boardSize = 10;
let totalMines = 10;

export function placeMines(excludeRow, excludeCol) {
  mineLocations = [];
  while (mineLocations.length < totalMines) {
      let row = Math.floor(Math.random() * boardSize);
      let col = Math.floor(Math.random() * boardSize);
      if (row != excludeRow || col != excludeCol) {
          if (!mineLocations.some(loc => loc[0] === row && loc[1] === col)) {
              mineLocations.push([row, col]);
          }
      }
  }
}

export function revealMines() {
  for (let loc of mineLocations) {
      let cell = document.getElementById(loc[0] + '-' + loc[1]);
      if(cell.children.length > 0 && cell.children[0].className === 'fa-solid fa-flag fa-fade') {
          continue; // skip if the cell is flagged
      }
      const bomb = document.createElement('i');
      bomb.className = 'fa-solid fa-bomb fa-beat';
      cell.appendChild(bomb);
      cell.classList.add('chosen');
  }

  let cells = document.querySelectorAll('.cell');
  for (let cell of cells) {
      if(cell.children.length > 0 && cell.children[0].className === 'fa-solid fa-flag fa-fade') {
          let [i, j] = cell.id.split('-');
          if (!mineLocations.some(loc => loc[0] == i && loc[1] == j)) {
              cell.classList.add('flaged_incorrectly');
          }
      }
  }
}

export function countMines(row, col) {
  let count = 0;
  for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, boardSize - 1); i++) {
      for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, boardSize - 1); j++) {
          if (mineLocations.some(loc => loc[0] === i && loc[1] === j)) {
              count++;
          }
      }
  }
  return count;
}

export function resetMineLocations() {
  mineLocations = undefined;
}

export function updateMineCounter() {
  let flags = document.querySelectorAll('.fa-flag').length;
  let mineCounter = document.querySelector('.mine-counter');
  mineCounter.innerHTML = totalMines - flags;
}
