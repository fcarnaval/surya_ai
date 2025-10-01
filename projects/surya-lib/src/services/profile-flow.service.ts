import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { SuryaLibConfigService } from '../lib/surya-lib-config.service';
import { SpinnerService } from '../components/spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileFlowService {
    apiHost: string;
    private profileData: any = {};
    result: any;
    // When used from surya-admin, this will be set to target user's id
    private adminUserId: string | null = null;

    constructor(private http: HttpClient, 
                private configService: SuryaLibConfigService,
                private spinner: SpinnerService
              ) {
        this.apiHost = this.configService.getConfig().apiHost;
    }

    setUserId(userId: string | null): void {
        this.adminUserId = userId;
    }

    saveStepData(modelName: string, data: any): Promise<void> {
        this.spinner.spin();
        return new Promise((resolve, reject) => {
            this.profileData[modelName] = data;
            console.log('Dados salvos localmente:', this.profileData);

            let payload: any;

            if (modelName != 'TongueCapture') {

                if (modelName == 'DietDetails') {
                    payload = {
                        model: modelName,
                        meals: data
                    };
                } else {
                    payload = {
                        model: modelName,
                        ...data
                    };
                }

                const userQuery = this.adminUserId ? `&user_id=${encodeURIComponent(this.adminUserId)}` : '';
                this.http.post(this.apiHost + `profile-data/?model=${modelName}${userQuery}`, payload).subscribe({
                    next: (response) => {
                      this.spinner.stop();
                        console.log(`Dados do modelo ${modelName} salvos no Django:`, response);
                        resolve();
                    },
                    error: (error) => {
                      this.spinner.stop();
                        console.error(`Erro ao salvar modelo ${modelName} no Django:`, error);
                        reject(error);
                    }
                });

            } else {

                this.http.post(this.apiHost + 'tongue-capture/', data).subscribe({
                    next: (response) => {
                      this.spinner.stop();
                        console.log(`Dados do modelo ${modelName} salvos no Django:`, response);
                        resolve();
                    },
                    error: (error) => {
                      this.spinner.stop();
                        console.error(`Erro ao salvar modelo ${modelName} no Django:`, error);
                        reject(error);
                    }
                });

            }
        });
    }

    getProfileData(modelName: string): Promise<any> {
      console.log("Spin");
      this.spinner.spin();
        return new Promise((resolve, reject) => {

            if (modelName != 'TongueCapture') {
                const userQuery = this.adminUserId ? `&user_id=${encodeURIComponent(this.adminUserId)}` : '';
                this.http.get(`${this.apiHost}profile-data/?model=${modelName}${userQuery}`).subscribe({
                    next: (response) => {
                      this.spinner.stop();
                        console.log(`Dados do modelo ${modelName} recuperados do Django:`, response);
                        this.profileData[modelName] = response;
                        resolve(response);
                    },
                    error: (error) => {
                      this.spinner.stop();
                        console.error(`Erro ao recuperar modelo ${modelName} do Django:`, error);
                        reject(error);
                    }
                });
            } else {
                this.http.get(`${this.apiHost}tongue-capture/`).subscribe({
                    next: (response) => {
                      this.spinner.stop();
                        console.log(`Dados do modelo ${modelName} recuperados do Django:`, response);
                        this.profileData[modelName] = response;
                        resolve(response);
                    },
                    error: (error) => {
                      this.spinner.stop();
                        console.error(`Erro ao recuperar modelo ${modelName} do Django:`, error);
                        reject(error);
                    }
                });
            }
        });
    }

}
