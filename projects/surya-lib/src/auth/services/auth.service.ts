// auth.service.ts
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool
} from 'amazon-cognito-identity-js';
import { Injectable } from '@angular/core';
import { SuryaLibConfigService } from '../../lib/surya-lib-config.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  userPool;

  cognitoUser: CognitoUser | null = null;

  constructor(private config: SuryaLibConfigService) {
    this.userPool = new CognitoUserPool({
    UserPoolId: this.config.cognito.userPoolId,
    ClientId: this.config.cognito.clientId
  });
  }

  signIn(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: this.userPool
      };

      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password
      });

      const cognitoUser = new CognitoUser(userData);
      this.cognitoUser = cognitoUser;

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            idToken: result.getIdToken().getJwtToken(),
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken()
          });
        },
        onFailure: (err) => {
          reject(err);
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          resolve({ challenge: 'NEW_PASSWORD_REQUIRED', userAttributes });
        }
      });
    });
  }

  completeNewPassword(newPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.cognitoUser) return reject("Usuário não autenticado");

      this.cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
        onSuccess: (result) => {
          resolve({
            idToken: result.getIdToken().getJwtToken(),
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken()
          });
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  }
}
