import cors from "cors";
import express from "express";
import { setupHighscoreEndpoint } from "./endpoints/highscoreGet";
import { setupSubmitHighscoreEndpoint } from "./endpoints/highscorePost";
import { setupWebhookEndpoint } from "./endpoints/webhookPost";

const app = express();

app.use(cors());

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

setupHighscoreEndpoint(app);
setupSubmitHighscoreEndpoint(app);
setupWebhookEndpoint(app);

export { app };
