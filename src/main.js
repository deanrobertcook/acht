import React from "react";
import ReactDOM from "react-dom";

class Square extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    }
  }

  render() {
    return (
      <a className="width-max height-max bg-color-hero color-hero block fs-l txt-center lh-4r mg-0 hover--pointer"
        onClick={() => this.setState({ value: 'X' })}
      >
        {this.state.value}
      </a>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div className="flex-stack gap-m">
        <div className="mg-center width-max-content block" >{status}</div>
        <div className="grid-3 grid-square-4r gap-s place-items-center mg-center width-min" >
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>

    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
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
