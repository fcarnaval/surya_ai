import { Injectable } from '@angular/core';
import { SuryaLibConfig } from './surya-lib-config';

@Injectable({
  providedIn: 'root'
})
export class SuryaLibConfigService {
  private config!: SuryaLibConfig;

  setConfig(config: SuryaLibConfig): void {
    this.config = config;
  }

  getConfig(): SuryaLibConfig {
    if (!this.config) {
      throw new Error('SuryaLibConfigService: Config not set.');
    }
    return this.config;
  }

  get apiHost(): string {
    return this.getConfig().apiHost;
  }

  get cognito(): SuryaLibConfig['cognito'] {
    return this.getConfig().cognito;
  }
}
