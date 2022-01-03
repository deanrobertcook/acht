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
  } = props
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
    winner: undefined,
    animating: [],
    draw: false,
  };

  constructor(props) {
    super(props);
    this.state = Board.initialState;

    this.onSquareClick = (index) => {
      const {
        next,
        turn,
        squares, 
      } = this.state;

      if (squares[index] != null) {
        return;
      }

      const newSquares = squares.slice();
      newSquares[index] = {
        player: next,
        turn
      };
      const winningLine = this.calculateWinningLine(newSquares);

      const draw = newSquares.every(x => !!x);

      if (winningLine) {
        this.animateReset(winningLine);
      } else if (draw) {
        this.animateReset(Array.from(newSquares.keys()));
      }

      this.setState((state, props) => ({
        squares: newSquares,
        next: state.next == 'X' ? 'O' : 'X',
        turn: state.next == 'O' ? state.turn + 1 : state.turn,
        winningLine,
        winner: newSquares[winningLine?.at(0)]?.player,
        draw
      }))
    }
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
      winner, 
      winningLine, 
      animating, 
      draw
    } = this.state;

    let status;
    if (winner) {
      status = `Winner: ${winner}`
    } else if (draw) {
      status = 'Draw!'
    } else {
      status = `Next player: ${next}`
    }

    return (
      <div className="flex flex-col">
        <div className="mx-auto w-max block mb-4">{status}</div>
        <div className="grid grid-os-xs gap-2 place-items-center mx-auto w-min">

          {squares.map((square, index) => {
            return <Square 
              key={index} 
              value={square?.player} 
              active={!square?.player && !winner} 
              highlight={winningLine && winningLine.includes(index)} 
              animate={animating.includes(index)}
              onClick={() => this.onSquareClick(index)} />;
          }) }
        </div>
      </div>
    );
  }
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

