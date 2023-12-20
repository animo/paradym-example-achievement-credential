interface Vector {
  x: number;
  y: number;
}

const initialState = {
  snake: {
    direction: {
      x: 0,
      y: 0,
    },
    bodyParts: [],
  },
  food: {
    position: {
      x: 0,
      y: 0,
    },
  },
  game: {
    gridSize: {
      x: 0,
      y: 0,
    },
    scoreBoard: {
      currentScore: 0,
      highscore: 0,
    },
  },
};
