import './style.css';

import React from "react";
import ReactDOM from "react-dom";

function Square(props) {
  const {
    active,
    highlight,
    animate,
    value,
    onClick
  } = props;
  const pointer = active ? "cursor-pointer" : "pointer-events-none";
  const color = highlight ? "text-dark-orange" : "text-baby-blue";
  const animation = animate ? "animate-ping-once" : "";
  return (
    <div className={`w-full h-full bg-dark-blue ${pointer}`}
      onClick={onClick}
    >
      <p className={`text-center text-[2rem] leading-[4rem] ${color} ${animation}`}>
        {value}
      </p>
    </div>
  );
}

class Board extends React.Component {

  static initialState = {
    next: 'X',
    turn: 1,
    squares: Array(9).fill(null),
    winningLine: undefined,
    animating: [],
  };

  constructor(props) {
    super(props);
    this.state = Board.initialState;
  }

  onSquareClick(index) {
    const {
      next,
      turn,
      squares,
      winningLine
    } = this.state;

    if (squares[index] || winningLine || this.isDraw()) {
      return;
    }

    const newSquares = squares.slice();
    newSquares[index] = {
      player: next,
      turn
    };

    this.setState((state, props) => ({
      squares: newSquares,
      next: state.next == 'X' ? 'O' : 'X',
      turn: state.next == 'O' ? state.turn + 1 : state.turn,
      winningLine: this.calculateWinningLine(newSquares)
    }));
  }

  isDraw() {
    return this.state.squares.every(x => !!x);
  }

  calculateWinningLine(squares) {
    const winningLine = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ].find(line => {
      return squares[line[0]]?.player && 
        squares[line[0]]?.player === squares[line[1]]?.player &&
        squares[line[0]]?.player === squares[line[2]]?.player
    });
    // Sort the winning line in the turn order in which the winning player put down their pieces.
    return winningLine?.sort((a, b) => squares[a].turn - squares[b].turn);
  }

  componentDidUpdate() {
    const {
      next,
      winningLine,
      squares,
      animating
    } = this.state;
    const draw = this.isDraw();
    if (winningLine && animating.length == 0) {
      this.animateReset(winningLine);
    } else if (draw && animating.length == 0) {
      this.animateReset(Array.from(squares.keys()));
    } else if (next == 'O') { //AI's turn
      // Fake a "thinking" time for the AI, then pick a move;
      setTimeout(() => this.onSquareClick(getAiMove(this.state.squares)), Math.random() * 300 + 500);
    } 
  }

  animateReset(elsToAnimate) {
    setTimeout(() => {
      elsToAnimate.forEach((e, i) => {
        setTimeout(
          () => this.setState((state, props) => ({
            animating: state.animating.concat(e)
          })),
          i * 300
        );
        setTimeout(
          () => this.setState(Board.initialState),
          (elsToAnimate.length - 1) * 300 + 1000
        )
      });
    },
    700);
  }

  render() {
    const {
      next, 
      squares, 
      winningLine, 
      animating
    } = this.state;

    const aiNext = next == 'O';

    return (
      <div className="flex flex-col">
        <div className="mx-auto w-max block mb-4">{this.getStatus()}</div>
        <div className="grid grid-os-xs gap-2 place-items-center mx-auto w-min">

          {squares.map((square, index) => {
            return <Square 
              key={index} 
              value={square?.player} 
              active={!aiNext && !square?.player && !winningLine} 
              highlight={winningLine && winningLine.includes(index)} 
              animate={animating.includes(index)}
              onClick={() => aiNext ? {} : this.onSquareClick(index)} />;
          }) }
        </div>
      </div>
    );
  }

  getStatus() {
    const {
      next, 
      squares,
      winningLine
    } = this.state;

    const winner = squares[winningLine?.at(0)]?.player;
    const draw = this.isDraw();

    let status;
    if (winner) {
      status = winner == 'X' ? 'You won!' : 'I win!';
    } else if (draw) {
      status = 'Draw!';
    } else {
      status = next == 'X' ? 'Your turn!' : 'Hmm...';
    }

    return status;
  }
}

// Returns the AI's next move choice (the index to put down an 'O')
function getAiMove(board) {
  const availableMoveIndicies = board
    .map((v, i) => !v ? i : null) //map null elements to their index, otherwise null
    .filter(v => !!v) //filter out the nulls

  const nth = Math.floor(Math.random() * availableMoveIndicies.length); //pick the nth null spot
  return availableMoveIndicies[nth]; //return the index of the nth element;
}

class Game extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
const root = document.getElementById('react');
if (root) {
  ReactDOM.render(<Game />, root);
}

