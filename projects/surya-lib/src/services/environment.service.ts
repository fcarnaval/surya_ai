import { Injectable } from '@angular/core';

export interface Environment {
  version: string;
  production: boolean;
  // Add other environment properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private _environment: Environment = {
    version: '1.0.0',
    production: false
  };

  setEnvironment(env: Environment) {
    this._environment = env;
  }

  get environment(): Environment {
    return this._environment;
  }

  get version(): string {
    return this._environment.version;
  }
}