/* eslint-disable react-hooks/exhaustive-deps */
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";

import { fetchHighScoreFromAPI, postScoreToAPI } from "../api";
import "./GameBoard.css";
import { GameOverOverlay } from "./GameOverOverlay";

export const GameBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scoreBoard, setScoreBoard] = useState<{
    highscore: number;
    currentScore: number;
  }>({ highscore: 0, currentScore: 0 });

  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState<Snake>();

  const [food, setFood] = useState<{ top: number; left: number }>();
  const [direction, setDirection] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const checkFoodCollision = (newSnake: { top: number; left: number }[]) => {
    if (!food) return false;

    const head = newSnake[0];
    if (head.top === food.top && head.left === food.left && canvasRef.current) {
      setFood({
        top:
          Math.floor(Math.random() * (canvasRef.current.height / gridSize)) *
          gridSize,
        left:
          Math.floor(Math.random() * (canvasRef.current.width / gridSize)) *
          gridSize,
      });
      newSnake.push({ ...newSnake[newSnake.length - 1] }); // Add a new segment to the snake at its current tail position
      return true;
    }
    return false;
  };

  const checkSelfCollision = (newSnake: { top: number; left: number }[]) => {
    const head = newSnake[0];
    for (let i = 1; i < newSnake.length; i++) {
      if (newSnake[i].top === head.top && newSnake[i].left === head.left) {
        return true;
      }
    }
    return false;
  };

  // Define the direction type for better type checking
  type Direction = {
    top: number;
    left: number;
  };

  // Define the segment type for the snake's body
  type Segment = {
    top: number;
    left: number;
  };

  // Define the snake type as an array of segments
  type Snake = Segment[];

  // The main moveSnake function
  const moveSnake = (direction: Direction) => {
    // Guard clause to ensure canvasRef.current is defined
    if (!canvasRef.current) {
      console.error("Canvas reference is not defined.");
      return;
    }

    // Extract canvas dimensions
    const canvasHeight = canvasRef.current.height;
    const canvasWidth = canvasRef.current.width;

    // Update the snake's position
    setSnake((prevSnake: Snake | undefined) => {
      if (!prevSnake) return prevSnake;
      const newSnake = calculateNewSnakePosition(
        prevSnake,
        direction,
        canvasHeight,
        canvasWidth
      );
      handleCollisions(newSnake);
      return newSnake;
    });
  };

  // Function to calculate the new position of the snake
  const calculateNewSnakePosition = (
    prevSnake: Snake,
    direction: Direction,
    canvasHeight: number,
    canvasWidth: number
  ): Snake => {
    return prevSnake.map((segment, index) => {
      if (index === 0) {
        // Calculate new head position
        const newTop = segment.top + direction.top * gridSize;
        const newLeft = segment.left + direction.left * gridSize;

        // Check for wall collisions
        if (
          newTop < 0 ||
          newLeft < 0 ||
          newTop >= canvasHeight ||
          newLeft >= canvasWidth
        ) {
          setGameOver(true);
          return segment; // Return the old head position
        }

        // Return the new head position
        return { top: newTop, left: newLeft };
      } else {
        // The rest of the snake follows the previous segment
        return prevSnake[index - 1];
      }
    });
  };

  // Function to handle any collisions that may have occurred
  const handleCollisions = (newSnake: Snake) => {
    if (!gameOver) {
      if (checkSelfCollision(newSnake)) {
        setGameOver(true);
      }
    }
  };

  useEffect(() => {
    if (food && checkFoodCollision(snake ?? [])) {
      // setScore(score + 1);
      setScoreBoard({
        ...scoreBoard,
        currentScore: (scoreBoard.currentScore += 1),
      });
    }
  }, [snake, food, scoreBoard]);

  const gridSize = 10; // Define the size of the grid

  const setup = (currentCanvas: HTMLCanvasElement) => {
    currentCanvas.width = currentCanvas.offsetWidth;
    currentCanvas.height = currentCanvas.offsetHeight;

    setSnake([
      {
        top: Math.floor(currentCanvas.height / 2 / gridSize) * gridSize,
        left: Math.floor(currentCanvas.width / 2 / gridSize) * gridSize,
      },
    ]);
    setFood({
      top:
        Math.floor(Math.random() * (currentCanvas.height / gridSize)) *
        gridSize,
      left:
        Math.floor(Math.random() * (currentCanvas.width / gridSize)) * gridSize,
    });
  };

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setup(canvas);
    }
  }, []);

  useLayoutEffect(() => {
    // Define a type for the keys used in directionMap
    type DirectionKey = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

    const handleKeyDown = (event: { key: string }) => {
      const directionMap: {
        [key in DirectionKey]: { top: number; left: number };
      } = {
        ArrowUp: { top: -1, left: 0 },
        ArrowDown: { top: 1, left: 0 },
        ArrowLeft: { top: 0, left: -1 },
        ArrowRight: { top: 0, left: 1 },
      };

      // Ensure event.key is a DirectionKey before indexing directionMap
      if (!Object.keys(directionMap).includes(event.key)) return;

      const newDirection = directionMap[event.key as DirectionKey];

      if (!newDirection) return; // Early return if key is not an arrow key
      // Prevent the snake from moving in the opposite direction
      if (
        !(direction.top === -newDirection.top && direction.top !== 0) ||
        (direction.left === -newDirection.left && direction.left !== 0)
      ) {
        // return;
        setDirection(newDirection);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction]);

  const drawGame = useCallback(
    (currentRef: HTMLCanvasElement) => {
      const ctx = currentRef.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(0, 0, currentRef.width, currentRef.height);
        ctx.fillStyle = "green";
        snake?.forEach((segment) => {
          ctx.fillRect(segment.left, segment.top, 10, 10);
        });
        ctx.fillStyle = "red";
        if (food) {
          ctx.fillRect(food.left, food.top, 10, 10);
        }
      }
    },
    [food, snake]
  );

  useEffect(() => {
    const fetchHighScore = async () => {
      const res = await fetchHighScoreFromAPI();
      setScoreBoard({ ...scoreBoard, highscore: res.highscore });
    };
    fetchHighScore();
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const canvas = canvasRef.current;

    let animationFrameId: number;

    //Our draw came here
    const render = () => {
      if (canvas) {
        drawGame(canvas);
        animationFrameId = window.requestAnimationFrame(render);
      }
    };

    render();
    const moveSnakeIntervalId = setInterval(() => {
      moveSnake(direction);
    }, 100); // Adjust the interval as needed to control the speed of the snake

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      clearInterval(moveSnakeIntervalId);
    };
  }, [drawGame, direction]);

  useEffect(() => {
    const postScore = async () => {
      const response = await postScoreToAPI(scoreBoard.currentScore);
      const invite = response.invitationData;
      window.open(invite.invitationUrl, "_blank", "noopener,noreferrer");
    };

    if (gameOver && scoreBoard.currentScore > scoreBoard.highscore) {
      postScore();
    }
  }, [gameOver]);

  return (
    <div className="game-board">
      <h1 id="game-board-title">Paradym Snake</h1>
      <div className="game-container">
        <canvas ref={canvasRef} className="canvas-pane">
          {/* Game will be rendered here */}
        </canvas>
      </div>
      {gameOver ? (
        <GameOverOverlay
          score={scoreBoard.currentScore}
          highScore={scoreBoard.highscore}
        />
      ) : (
        <div className="scoreboard-container">
          <div className="scoreboard-live">
            <p>Score: {scoreBoard.currentScore}</p>
          </div>
          <div className="highscore-live">
            <p>High Score: {scoreBoard.highscore}</p>
          </div>
        </div>
      )}
    </div>
  );
};
