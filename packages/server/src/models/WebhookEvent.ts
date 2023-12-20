// Enums and interfaces
export enum WorkflowExecutionState {
  WorkflowExecutionStarted = "workflowExecution.started",
  WorkflowExecutionActionExecuted = "workflowExecution.actionExecuted",
  WorkflowExecutionCompleted = "workflowExecution.completed",
  WorkflowExecutionWaitingForTrigger = "workflowExecution.waitingForTrigger",
  WorkflowExecutionCanceled = "workflowExecution.canceled",
}

export interface WebhookEvent {
  webhookId: string;
  eventType: WorkflowExecutionState;
  payload: {
    workflowId: string;
    workflowExecutionId: string;
    workflowActionId?: string;
  };
  error?: {
    message: string;
    code: string;
    details: string;
  };
  [key: string]: any;
}

export type WebhookEventTypes = {
  invitationActionCompleted: [workflowExecutionId: string, event: WebhookEvent];
};
