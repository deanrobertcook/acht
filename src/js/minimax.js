// Inspiration taken from:
// https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37/

const AI_PLAYER = 'O';
const HU_PLAYER = 'X';

// Returns the AI's next move choice (the index to put down an 'O')
export function getAiMove(fullBoard) {
  // return randomAiSelection(fullBoard);
  const board = fullBoard.map(v => v?.player); //The AI doesn't need turn informatio
  return minimax(board, AI_PLAYER).index;
}

function randomAiSelection(board) {
  const availableMoveIndicies = board
    .map((v, i) => !v ? i : null) //map null elements to their index, otherwise null
    .filter(v => !!v) //filter out the nulls

  const nth = Math.floor(Math.random() * availableMoveIndicies.length); //pick the nth null spot
  return availableMoveIndicies[nth]; //return the index of the nth element;
}

export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

export function minimax(board, player) {
  const winningLine = calculateWinningLine(board);
  const winner = board[winningLine?.at(0)];

  const draw = board.every(x => !!x);

  if (winner === AI_PLAYER) {
    return { score: 10 };
  } else if (winner === HU_PLAYER) {
    return { score: -10 };
  } else if (draw) {
    return { score: 0 };
  }

  const scores = board
    .map((v, i) => !v ? i : null) //map null elements to their index, otherwise null
    .filter(v => v != null) //filter out the nulls
    .map(i => {
      const newBoard = board.slice();
      newBoard[i] = player;
      return {
        index: i,
        score: minimax(newBoard, player === 'X' ? 'O' : 'X').score
      }
    });

  var best = -1;
  var comp = player == AI_PLAYER ? -11 : 11;
  for (var i = 0; i < scores.length; i++) {
    const score = scores[i].score;
    if (player == AI_PLAYER && score > comp || 
      player != AI_PLAYER && score < comp) {
        comp = score;
        best = i;
      }
  }
  return scores[best];
}

// A simpler winning lines method that doesn't care about turn order
function calculateWinningLine(board) {
  return WINNING_LINES.find(line => {
    return board[line[0]] &&
      board[line[0]] === board[line[1]] &&
      board[line[0]] === board[line[2]]
  });
}