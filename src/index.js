import './index.html';
import './index.scss';
import winSound from './sounds/winsound.mp3';
import gameOverSound from './sounds/gameoversound.mp3';
import clickCellSound from './sounds/revealsound.mp3';
import flagCellSound from './sounds/flagsound.mp3';
import { startTimer, startTime, timerInterval, getElapsedTime, elapsedTime, resetTimeVariables } from './modules/time';
import { placeMines, revealMines, countMines, mineLocations, resetMineLocations, updateMineCounter } from './modules/mines';
import { createModal, showModal } from './modules/modal';

let board;
let totalMines = 10;
let boardSize = 10;
let firstMove = true;
export let gameActive = true;
let openedCells = 0;
let moves = 0;
let winSoundAudio = new Audio(winSound);
let gameOverSoundAudio = new Audio(gameOverSound);
let clickCellSoundAudio = new Audio(clickCellSound);
let flagCellSoundAudio = new Audio(flagCellSound);
let selectedTheme = localStorage.getItem('theme') || 'dark';

const heading = document.createElement('h1');
heading.innerHTML = 'Minesweeper';
heading.classList.add('heading');
document.body.append(heading);
const subheading = document.createElement('h2');
subheading.innerHTML = 'Rules';
subheading.classList.add('subheading');
document.body.append(subheading);
const subheadingDescr = document.createElement('p');
subheadingDescr.innerHTML = 'The board is divided into cells, with mines randomly distributed. To win, you need to open all the cells. The number on a cell shows the number of mines adjacent to it. Using this information, you can determine cells that are safe, and cells that contain mines. Cells suspected of being mines can be marked with a flag using the right mouse button.';
subheadingDescr.classList.add('subheading_descr');
document.body.append(subheadingDescr);

function createPlayBoard() {

  let existingBoard = document.querySelector('.game-board');
  if (existingBoard) {
      document.body.removeChild(existingBoard);
  }
  const gameBoard = document.createElement('div');
  gameBoard.classList.add('game-board');
  document.body.append(gameBoard);
  board = new Array(boardSize);

  for (let i = 0; i < boardSize; i++) {
      board[i] = new Array(boardSize).fill(0);
  }

  gameBoard.innerHTML = '';

  let headerBoard = document.createElement('div');
  headerBoard.className = 'header-board';
  let mineCounter = document.createElement('div');
  mineCounter.className = 'mine-counter';
  let resetButton = document.createElement('button');
  resetButton.className = 'reset-button';
  const smile = document.createElement('i');
  smile.className = 'fa-solid fa-face-smile';
  smile.style.color = '#f9e401';
  resetButton.appendChild(smile);

  resetButton.addEventListener('click', resetGame);

  let timer = document.createElement('div');
  timer.className = 'timer';
  timer.innerHTML = elapsedTime;
  headerBoard.appendChild(mineCounter);
  headerBoard.appendChild(resetButton);
  headerBoard.appendChild(timer);
  gameBoard.appendChild(headerBoard);

  let cells = document.createElement('div');
  cells.className = 'cells';
  for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
          let cell = document.createElement('div');
          cell.addEventListener('click', function() { clickCell(i, j); });
          cell.addEventListener('contextmenu', function(e) {
              e.preventDefault();
              flagCell(i, j);
          });
          cell.id = i + '-' + j;
          cell.className = 'cell';
          cells.appendChild(cell);
      }
  }
  gameBoard.appendChild(cells);
  let footerBoardText = document.createElement('div');
  footerBoardText.className = 'footer-board__text';
  gameBoard.appendChild(footerBoardText);
  updateMineCounter();

  const themeSelector = document.createElement('div');
  themeSelector.classList.add('theme-selector');

  const lightModeLabel = document.createElement('label');
  lightModeLabel.innerHTML = 'Light mode ';
  const lightModeRadio = document.createElement('input');
  lightModeRadio.type = 'radio';
  lightModeRadio.name = 'theme';
  lightModeRadio.value = 'light';
  lightModeLabel.appendChild(lightModeRadio);
  themeSelector.appendChild(lightModeLabel);

  const darkModeLabel = document.createElement('label');
  darkModeLabel.innerHTML = 'Dark mode ';
  const darkModeRadio = document.createElement('input');
  darkModeRadio.type = 'radio';
  darkModeRadio.name = 'theme';
  darkModeRadio.value = 'dark';
  darkModeRadio.checked = true;
  darkModeLabel.appendChild(darkModeRadio);
  themeSelector.appendChild(darkModeLabel);

  darkModeRadio.addEventListener('change', handleThemeChange);
  lightModeRadio.addEventListener('change', handleThemeChange);

  gameBoard.insertBefore(themeSelector, footerBoardText.nextSibling);
  
  if (selectedTheme === 'light') {
    lightModeRadio.checked = true;
    handleThemeChange({ target: lightModeRadio }); // Apply light theme
  } else if (selectedTheme === 'dark') {
    darkModeRadio.checked = true;
    handleThemeChange({ target: darkModeRadio }); // Apply dark theme
  }
}

createPlayBoard();

function clickCell(i, j, isAutoOpen = false) {
  clickCellSoundAudio.play();
  if (!gameActive) return;
  let cell = document.getElementById(i + '-' + j);
  if (firstMove) {
      firstMove = false;
      placeMines(i, j);
      startTimer();
  }
  if (mineLocations.some(loc => loc[0] === i && loc[1] === j)) {
    gameOverSoundAudio.play()
    gameActive = false;
    clearInterval(timerInterval);
    revealMines();
    createModal();
    showModal('Game over. Try again');
    let resetButton = document.querySelector(".reset-button");
    resetButton.children[0].classList.remove('fa-face-smile');
    resetButton.children[0].classList.add('fa-face-frown');
    return;
  }
  if (cell.classList.contains('chosen')) return;
  let mineCount = countMines(i, j);
  cell.innerHTML = mineCount > 0 ? mineCount : '';
  cell.classList.add('chosen');
  cell.setAttribute('data-mine-count', mineCount);
  if (!isAutoOpen) {
    moves++;
  }
  openedCells++;
  if (mineCount === 0) {
    openAdjacentCells(i, j);
  }
  if (openedCells === (boardSize * boardSize) - totalMines) {
    winSoundAudio.play();
    gameActive = false;
    clearInterval(timerInterval);
    revealMines();
    createModal();
    showModal(`Hooray! You found all mines in ${getElapsedTime()} seconds and ${moves} moves!`);
  }
  updateMovesCount();
}

function flagCell(i, j) {
  flagCellSoundAudio.play();
  if (!gameActive) return;
  let cell = document.getElementById(i + '-' + j);
  if (cell.classList.contains('chosen')) return;
  if (cell.children.length > 0 && cell.children[0].className === 'fa-solid fa-flag fa-fade') {
      cell.removeChild(cell.children[0]);
  } else {
      const flaged = document.createElement('i');
      flaged.className = 'fa-solid fa-flag fa-fade';
      flaged.style.color = '#ff1100';
      cell.appendChild(flaged);
      moves++;
  }
  updateMineCounter();
  updateMovesCount();
}

function resetGame() {

  clearInterval(timerInterval);
  const savedTheme = localStorage.getItem('theme');
  selectedTheme = savedTheme;

  board = undefined;
  totalMines = 10;
  boardSize = 10;
  firstMove = true;
  gameActive = true;
  openedCells = 0;
  moves = 0;
  resetMineLocations();
  resetTimeVariables();

  createPlayBoard();

  if (selectedTheme === 'light') {
    document.body.style.backgroundColor = '#e9e9e9';
    document.body.style.color = '#1d1d1d';
    document.querySelector('.timer').style.backgroundColor = 'rgb(236 235 235)';
    document.querySelector('.timer').style.color = '#3250ee';
    document.querySelector('.mine-counter').style.backgroundColor = 'rgb(236 235 235)';
    document.querySelector('.mine-counter').style.color = '#3250ee';
  } else if (selectedTheme === 'dark') {
    document.body.style.backgroundColor = '#1d1d1d';
    document.body.style.color = '#e9e9e9';
    document.querySelector('.timer').style.backgroundColor = '#1d1d1d';
    document.querySelector('.timer').style.color = '#FF0';
    document.querySelector('.mine-counter').style.backgroundColor = '#1d1d1d';
    document.querySelector('.mine-counter').style.color = '#FF0';
  }
}

export function updateMovesCount() {
  let footerBoardText = document.querySelector('.footer-board__text');
  footerBoardText.innerHTML = `Number of clicks: ${moves}`;
}

function openAdjacentCells(i, j) {
  for (let x = Math.max(i - 1, 0); x <= Math.min(i + 1, boardSize - 1); x++) {
    for (let y = Math.max(j - 1, 0); y <= Math.min(j + 1, boardSize - 1); y++) {
      let cell = document.getElementById(x + '-' + y);
      if (!cell.classList.contains('chosen')) {
        clickCell(x, y, true);
      }
    }
  }
}

function handleThemeChange(event) {
  let selectedTheme = event.target.value;
  selectedTheme = selectedTheme;
  localStorage.setItem('theme', selectedTheme);

  if (selectedTheme === 'light') {
    document.body.style.backgroundColor = '#e9e9e9';
    document.body.style.color = '#1d1d1d';
    document.querySelector('.timer').style.backgroundColor = 'rgb(236 235 235)';
    document.querySelector('.timer').style.color = '#3250ee';
    document.querySelector('.mine-counter').style.backgroundColor = 'rgb(236 235 235)';
    document.querySelector('.mine-counter').style.color = '#3250ee';
  } else if (selectedTheme === 'dark') {
    document.body.style.backgroundColor = '#1d1d1d';
    document.body.style.color = '#e9e9e9';
    document.querySelector('.timer').style.backgroundColor = '#1d1d1d';
    document.querySelector('.timer').style.color = '#FF0';
    document.querySelector('.mine-counter').style.backgroundColor = '#1d1d1d';
    document.querySelector('.mine-counter').style.color = '#FF0';
  }
}
