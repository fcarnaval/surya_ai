export interface CognitoConfig {
  userPoolId: string;
  userPoolWebClientId: string;
  region: string;
  domain: string;
  clientId: string;
}

export interface SuryaLibConfig {
  production: boolean;
  apiHost: string;
  version: string;
  cognito: CognitoConfig;
}
