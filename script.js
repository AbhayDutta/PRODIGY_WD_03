document.addEventListener("DOMContentLoaded", () => {
  const gameCells = document.querySelectorAll('.gamecell');
  const resetButton = document.getElementById('reset-btn');
  const namesDialog = document.querySelector('.names-dialog');
  const namesDialogButton = document.getElementById('start-game');
  const resultDialog = document.querySelector('.result-dialog');
  const resultDialogMessage = resultDialog.querySelector('h1');
  const turnMessage = document.querySelector('main p');

  let player1, player2, currentPlayer, board, gameEnded;

  const Player = (name, symbol) => {
    return { name, symbol };
  };

  function startGame() {
    board = Array(9).fill(null);
    gameEnded = false;
    currentPlayer = player1;
    turnMessage.textContent = `${currentPlayer.name}'s Turn`;
    gameCells.forEach(cell => cell.textContent = '');
  }

  function checkWinner() {
    const combos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let combo of combos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a];
      }
    }
    if (board.every(cell => cell)) return 'tie';
    return null;
  }

  function handleMove(e) {
    const cell = e.target;
    const index = cell.dataset.position;

    if (gameEnded || board[index]) return;

    board[index] = currentPlayer.symbol;
    cell.textContent = currentPlayer.symbol;

    const winner = checkWinner();

    if (winner) {
      gameEnded = true;
      if (winner === 'tie') {
        resultDialogMessage.textContent = "It's a Tie!";
      } else {
        const winnerName = currentPlayer.name;
        resultDialogMessage.textContent = `${winnerName} Wins!`;
      }
      resultDialog.showModal();
    } else {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
      turnMessage.textContent = `${currentPlayer.name}'s Turn`;
    }
  }

  function resetGame() {
    startGame();
  }

  // Close result dialog on outside click
  resultDialog.addEventListener('click', (e) => {
    if (e.target === resultDialog) resultDialog.close();
  });

  // Set up event listeners after name input
  namesDialogButton.addEventListener('click', (e) => {
    e.preventDefault();
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();
    if (!name1 || !name2) return;

    player1 = Player(name1, 'X');
    player2 = Player(name2, 'O');
    namesDialog.close();
    startGame();
  });

  // Click listeners
  gameCells.forEach(cell => {
    cell.addEventListener('click', handleMove);
  });

  resetButton.addEventListener('click', resetGame);

  // Show the name dialog on load
  namesDialog.showModal();
});
