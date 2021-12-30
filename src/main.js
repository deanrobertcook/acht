import './style.css';

import React from "react";
import ReactDOM from "react-dom";

function Square(props) {
  const active = props.active ? "cursor-pointer" : "pointer-events-none"
  const color = props.highlight ? "text-dark-orange" : "text-baby-blue"
  return (
    <p className={`w-full h-full m-0 text-center bg-dark-blue text-[2rem] leading-[4rem] ${active} ${color}`}
      onClick={props.onClick}
    >
      {props.value}
    </p>
  );
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      next: 'X',
      squares: Array(9).fill(null)
    }

    this.onSquareClick = (index) => {
      if (this.state.squares[index] != null || this.state.winner != null) {
        return;
      }

      const newSquares = this.state.squares.slice();
      newSquares[index] = this.state.next;

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
        return newSquares[line[0]] != null && 
          newSquares[line[0]] === newSquares[line[1]] &&
          newSquares[line[0]] === newSquares[line[2]]
      });

      this.setState({
        squares: newSquares,
        next: this.state.next == 'X' ? 'O' : 'X',
        winningLine,
        winner: winningLine ? newSquares[winningLine[0]] : undefined
      })
    }
  }

  render() {
    const status = this.state.winner == null ? `Next player: ${this.state.next}` : `Winner: ${this.state.winner}`;

    return (
      <div className="flex flex-col">
        <div className="mx-auto w-max block mb-4">{status}</div>
        <div className="grid grid-os-xs gap-2 place-items-center mx-auto w-min">
          {this.state.squares.map((square, index) => {
            const active = square == null && this.state.winner == null;
            let highlight; 
              if (this.state.winningLine) {
                highlight = this.state.winningLine.includes(index);
              }
            return <Square key={index} value={square} highlight={highlight} active={active} onClick={() => this.onSquareClick(index)} />;
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
