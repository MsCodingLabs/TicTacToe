// Elemente aus dem DOM holen
const gameBoard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info");
const resetButton = document.querySelector("#reset");

// Startspieler ist "circle"
let go = "circle";
let gameOver = false;

// Anfangstext anzeigen
infoDisplay.textContent = "Circle goes first";

// Erstellt das Spielfeld mit 9 klickbaren Feldern
function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cellElement = document.createElement("div");
    cellElement.classList.add("square");
    cellElement.setAttribute("role", "button");
    cellElement.setAttribute("aria-label", "Spielfeld Zelle " + (i + 1));
    cellElement.id = i;
    cellElement.addEventListener("click", addGo);
    gameBoard.appendChild(cellElement);
  }
}

// Fügt "circle" oder "cross" ins geklickte Feld ein
function addGo(e) {
  const target = e.target;

  // Wenn Spiel vorbei oder Feld belegt, nichts tun
  if (gameOver || target.firstChild) return;

  const goDisplay = document.createElement("div");
  goDisplay.classList.add(go);
  target.appendChild(goDisplay);

  // Spieler wechseln
  go = go === "circle" ? "cross" : "circle";
  infoDisplay.textContent = `${
    go.charAt(0).toUpperCase() + go.slice(1)
  } goes next`;

  checkScore();
}

// Prüft, ob jemand gewonnen hat oder es ein Unentschieden gibt
function checkScore() {
  const allSquares = document.querySelectorAll(".square");
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Reihen
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Spalten
    [0, 4, 8],
    [2, 4, 6], // Diagonalen
  ];

  winningCombos.forEach((array) => {
    const circleWins = array.every((cell) =>
      allSquares[cell].firstChild?.classList.contains("circle")
    );
    const crossWins = array.every((cell) =>
      allSquares[cell].firstChild?.classList.contains("cross")
    );

    if (circleWins) {
      infoDisplay.textContent = "Circle wins!";
      gameOver = true;
      removeListeners();
    } else if (crossWins) {
      infoDisplay.textContent = "Cross wins!";
      gameOver = true;
      removeListeners();
    }
  });

  // Prüfen auf Unentschieden
  const isDraw = [...allSquares].every((cell) => cell.firstChild);
  if (!gameOver && isDraw) {
    infoDisplay.textContent = "It's a draw!";
    gameOver = true;
  }
}

// Entfernt alle Klick-Events, wenn Spiel vorbei ist
function removeListeners() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square) => square.removeEventListener("click", addGo));
}

// Spiel zurücksetzen
function resetGame() {
  gameBoard.innerHTML = "";
  infoDisplay.textContent = "Circle goes first";
  go = "circle";
  gameOver = false;
  createBoard();
}

// Event-Listener für den Neustart-Button
resetButton.addEventListener("click", resetGame);

// Spielfeld beim Laden erzeugen
createBoard();
