import { Express } from "express";
import { readHighscore } from "../highscoreUtil";

export function setupHighscoreEndpoint(app: Express) {
  app.get("/highscore", async (req, res) => {
    const highscore = await readHighscore();
    res.send({ highscore });
  });
}
