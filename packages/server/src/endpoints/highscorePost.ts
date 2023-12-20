import { readHighscore, writeHighScore } from "../highscoreUtil";
import * as paradym from "../paradymApi";
import { webhookEmitter } from "./webhookPost";
import { Express } from "express";
import moment from "moment";

export const setupSubmitHighscoreEndpoint = (app: Express) => {
  app.post("/highscore", async (req, res) => {
    const newHighscore = req.body.score;
    const highscore = await readHighscore();

    if (newHighscore > highscore) {
      await writeHighScore(newHighscore);
      const current_timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
      await paradym.issueCredential(newHighscore, current_timestamp);

      webhookEmitter.once(
        "invitationActionCompleted",
        async (executionId, event) => {
          console.log("received emitter event, fetching workflow execution");
          const execution = await paradym.getWorkflowExecutionById(executionId);

          console.log(
            `workflow execution: ${JSON.stringify(execution.data, null, 2)}`
          );
          res.send({
            result: true,
            invitationData:
              execution.data.payload.actions.createConnection.output,
          });
        }
      );
    } else {
      res.send({ result: false });
    }
  });
};
