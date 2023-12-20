import path from "path";
import fs from "fs";

export const readHighscore = async () => {
  let highscore = 0;
  const highscorePath = path.resolve(__dirname, "highscore.json");
  if (fs.existsSync(highscorePath)) {
    const data = await fs.promises.readFile(highscorePath, "utf8");
    highscore = JSON.parse(data).highscore;
  } else {
    await fs.promises.writeFile(highscorePath, JSON.stringify({ highscore }));
  }
  return highscore;
};

export const writeHighScore = async (score) => {
  const highscorePath = path.resolve(__dirname, "highscore.json");
  await fs.promises.writeFile(
    highscorePath,
    JSON.stringify({ highscore: score })
  );
};
