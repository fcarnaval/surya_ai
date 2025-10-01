export interface IProfileFlowService {
  submitStep(stepName: string, data: any): Promise<any>;
}

export interface IChatService {
  // Add chat service interface methods as needed
}