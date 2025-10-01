import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PlanRecommendations {
  sleep: string;
  exercise: string;
  treatment: string;
  nutrition: string;
  routine: string;
  spirituality: string;
}

export interface Plan {
  diagnosis: string;
  dosha: string;
  recommendations: PlanRecommendations;
  user_name: string;
  objective: string;
}

export interface PlanFoundResponse {
  status: 'found';
  user_id: string;
  plan: Plan;
  created_at: string;
  updated_at: string;
}

export interface PlanGeneratingResponse {
  status: 'generating';
  message: string;
  job_id: string;
  job_status: 'PROCESSING' | 'PENDING';
  created_at: string;
}

export interface PlanNotFoundResponse {
  status: 'not_found';
  message: string;
}

export type PlanResponse = PlanFoundResponse | PlanGeneratingResponse | PlanNotFoundResponse;

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiHost = environment.apiHost;

  constructor(private http: HttpClient) {}

  getPlan(): Observable<PlanResponse> {
    return this.http.get<PlanResponse>(`${this.apiHost}get-plan`);
  }
}