const { minimax } = require("./minimax");

test('Terminal losing state', () => {

  const board = [
    'X',  null, 'O',
    null, 'X',  'O',
    null, null, 'X'
  ];

  expect(minimax(board, 'O').score).toBe(-10);

});

test('Terminal winning state', () => {

  const board = [
    'X',  null, 'O',
    null, 'X',  'O',
    null, null, 'O'
  ];

  expect(minimax(board, 'X').score).toBe(10);
});

test('Draw state', () => {

  const board = [
    'X', 'X', 'O',
    'O', 'X', 'X',
    'X', 'O', 'O'
  ];

  expect(minimax(board, 'O').score).toBe(0);
});

test('Single step from losing state', () => {

  const board = [
    null, 'O',  'O',
    'O',  'X',  'X',
    'X',  'O',  'X',
  ];

  expect(minimax(board, 'X')).toEqual({
    score: -10,
    index: 0
  });
});

test('Single step from winning state', () => {

  const board = [
    null, 'O',  'O',
    'X',  'X',  'O',
    'X',  null, 'X',
  ];

  expect(minimax(board, 'O')).toEqual({
    score: 10,
    index: 0
  });
});

test('Impossible to lose', () => {

  const board = [
    null, 'O',  'O',
    null, null, 'O',
    'X',  'O',  'X',
  ];

  expect(minimax(board, 'X').score).toBe(10);
});