import { Express, Request, Response } from "express";
import { WebhookEvent, WorkflowExecutionState } from "../models";
import crypto from "crypto";
import EventEmitter from "events";
import process from "process";
export const webhookEmitter = new EventEmitter();

export const setupWebhookEndpoint = (app: Express) => {
  app.post("/webhook", (req: Request, res: Response) => {
    console.log("Received /webhook");
    if (!verifyHmac(req, process.env.PARADYM_HMAC_SIGNATURE)) {
      res.sendStatus(401);
      return;
    }

    const event = req.body as WebhookEvent;
    console.log(`Webhook event: ${JSON.stringify(event, null, 2)}`);

    // Guard to make sure we only emit events for webhooks related to our workflow
    if (event.payload.workflowId !== process.env.PARADYM_WORKFLOW_ID) return;

    // Guard to make sure we only emit events for webhooks that indicate the workflow is completed
    if (
      event.eventType !==
      WorkflowExecutionState.WorkflowExecutionWaitingForTrigger
    )
      return;

    if (event.payload.workflowActionId !== "createConnection") return;
    const executionId = event.payload.workflowExecutionId;
    webhookEmitter.emit("invitationActionCompleted", executionId, event);

    res.sendStatus(200);
  });
};

const verifyHmac = (req: Request, localHmac: string) => {
  const hmac = req.get("X-Paradym-HMAC-SHA-256");

  const computedHmac = crypto
    .createHmac("sha256", localHmac)
    .update(req.rawBody, "utf8")
    .digest("hex");

  return computedHmac === hmac;
};
