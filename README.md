# Minesweeper

Minesweeper is a classic puzzle game where players reveal squares on a grid, trying to avoid hidden mines. The objective is to open all the cells that do not contain mines.

This application is based on the following task:

- [RSSchool task, Minesweeper](https://github.com/rolling-scopes-school/tasks/blob/master/tasks/minesweeper/README.md)

## Stack
 - HTML
 - SCSS
 - JavaScript
 - Webpack

## Key Features:
 - **Dynamic Board Generation:** The game board is created dynamically through JavaScript, ensuring the initial HTML body is empty.
 - **Responsive Design:** The layout is fully responsive and adapts to various screen sizes starting from 500px in width, providing a clean and functional user experience on both desktop and mobile devices.
 - **Interactive Gameplay:** Players can open cells, flag potential mines, and enjoy automatic tile revealing when opening empty cells.
 - **Color-Coded Hints:** Each number indicating the surrounding mines is displayed with unique colors, providing visual clarity.
 - **Restart & Timer:** A "New Game" button allows the player to restart without reloading the page, and the game duration is displayed.
 - **Sound Effects:** Sounds accompany key game events, such as revealing a cell, flagging, and game outcomes.
 - **Dark/Light Themes:** The game includes a theme toggle for a dark or light experience, changing the overall visual presentation.

## How to Play:

1. Click on any cell to start the game.
2. Use left-click to open a cell and right-click to place a flag.
3. Avoid clicking on mines! The game ends when you open all cells that do not contain mines or trigger a mine.
4. Use the "New Game" button to restart at any time.

## How to Run:

1. Clone the repository:
```Shell
git clone https://github.com/<your-username>/minesweeper.git
```
2. Install dependencies:
```Shell
npm install
```
3. Run the project:
```Shell
npm start
```
4. Open the game in your browser at http://localhost:8080/

## Deployment:

The project is deployed using GitHub Pages. You can play the game also at this link:

[Link to the project](https://kate-shepel.github.io/Minesweeper/)