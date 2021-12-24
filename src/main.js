import React from "react";
import ReactDOM from "react-dom";

function Square(props) {
  const active = props.active ? "hover--pointer" : ""
  return (
    <a className={`width-max height-max bg-color-hero color-hero block fs-l txt-center lh-4r mg-0 ${active}`}
      onClick={props.onClick}
    >
      {props.value}
    </a>
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

      const newSquares = Array.from(this.state.squares);
      newSquares[index] = this.state.next;

      const winningLine = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 6, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6],
      ].find(line => {
        return newSquares[line[0]] != null && 
          newSquares[line[0]] === newSquares[line[1]] &&
          newSquares[line[0]] === newSquares[line[2]]
      });

      const winner = winningLine ? newSquares[winningLine[0]] : undefined;

      this.setState({
        squares: newSquares,
        next: this.state.next == 'X' ? 'O' : 'X',
        winner
      })
    }
  }

  render() {
    const status = this.state.winner == null ? `Next player: ${this.state.next}` : `Winner: ${this.state.winner}`;

    return (
      <div className="flex-stack gap-m">
        <div className="mg-center width-max-content block" >{status}</div>
        <div className="grid-3 grid-square-4r gap-s place-items-center mg-center width-min" >
          {this.state.squares.map((square, index) => {
            const active = square == null && this.state.winner == null;
            return <Square key={index} value={square} active={active} onClick={() => this.onSquareClick(index)} />;
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
