import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.PARADYM_API_KEY;
const WORKFLOW_ID = process.env.PARADYM_WORKFLOW_ID;

export async function getWorkflowExecutionById(workflowExecutionId: string) {
  const url = `https://api.paradym.id/v1/executions/${workflowExecutionId}`;
  const headers = {
    "x-access-token": API_KEY,
    "Content-Type": "application/json",
  };

  const response = await axios.get(url, { headers });
  return response;
}

export async function issueCredential(highscore: number, timestamp: string) {
  const url = "https://api.paradym.id/v1/executions";
  const headers = {
    "x-access-token": API_KEY,
    "Content-Type": "application/json",
  };
  const data = {
    workflowId: WORKFLOW_ID,
    input: {
      highscore: highscore.toString(),
      timestamp: timestamp,
    },
  };

  const response = await axios.post(url, data, { headers });
  console.debug(`Response: ${JSON.stringify(response.data)}`);
  return response;
}
