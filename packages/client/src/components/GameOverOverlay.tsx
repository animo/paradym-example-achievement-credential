import React from "react";
import "./GameOverOverlay.css";

interface GameOverOverlayProps {
  score: number;
  highScore: number;
}

export const WinnerOverlay: React.FC<GameOverOverlayProps> = (
  props: GameOverOverlayProps
) => (
  <div>
    <h1>
      <b>Congratulations!</b>
    </h1>
    <p>You won!</p>
    <p>Your Score: {props.score}</p>
    <p>Previous highscore: {props.highScore}</p>
    <br />
    <p>Please hang on while we're loading your achievement credential</p>
  </div>
);

export const LoserOverlay: React.FC<GameOverOverlayProps> = (
  props: GameOverOverlayProps
) => (
  <div>
    <h1>
      <b>Game Over!</b>
    </h1>
    <p>Your Score: {props.score}</p>
    <p>High Score: {props.highScore}</p>
    <br />
    <button
      className="play-again-button"
      onClick={() => window.location.reload()}
    >
      Play Again
    </button>
  </div>
);

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  score,
  highScore,
}) => {
  const highScoreBeaten = score > highScore;
  return (
    <div className="game-over-overlay">
      {highScoreBeaten ? (
        <WinnerOverlay score={score} highScore={highScore} />
      ) : (
        <LoserOverlay score={score} highScore={highScore} />
      )}
    </div>
  );
};
