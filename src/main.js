import './style.css';

import React from "react";
import ReactDOM from "react-dom";

function Square(props) {
  let {
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
    squares: Array(9).fill(null),
    winningLine: undefined,
    winner: undefined,
    animating: [],
  };

  constructor(props) {
    super(props);
    this.state = Board.initialState;

    this.onSquareClick = (index) => {
      if (this.state.squares[index] != null) {
        return;
      }

      const newSquares = this.state.squares.slice();
      newSquares[index] = this.state.next;
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
        winningLine,
        winner: winningLine ? newSquares[winningLine[0]] : undefined,
      }))
    }
  }

  calculateWinningLine(newSquares) {
    return [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ].find(line => {
      return newSquares[line[0]] != null && 
        newSquares[line[0]] === newSquares[line[1]] &&
        newSquares[line[0]] === newSquares[line[2]]
    });
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
    const status = this.state.winner == null ? `Next player: ${this.state.next}` : `Winner: ${this.state.winner}`;

    return (
      <div className="flex flex-col">
        <div className="mx-auto w-max block mb-4">{status}</div>
        <div className="grid grid-os-xs gap-2 place-items-center mx-auto w-min">

          {this.state.squares.map((square, index) => {
            const {winner, winningLine, animating} = this.state;
            return <Square 
              key={index} 
              value={square} 
              active={square == null && winner == null} 
              highlight={winningLine ? winningLine.includes(index) : false} 
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

ReactDOM.render(
  <Game />,
  document.getElementById('react')
);
