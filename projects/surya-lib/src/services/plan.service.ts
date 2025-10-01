import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuryaLibConfigService } from '../lib/surya-lib-config.service';

// Legacy interfaces for backward compatibility
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

// New interfaces for complete plan structure
export interface PlanMetadata {
  model_version: string;
  generator: string;
  generation_time?: string;
  generated_at?: string;
  content_key: string;
  tokens_used: string;
}

export interface CompletePlanItem {
  metadata: PlanMetadata;
  plan_type?: string;
  updated_at: string;
  user_id: string;
  user_name: string;
  created_at: string;
  plan_data: any;
  content_key?: string;
  plan_id: string;
  status: string;
}

export interface CompletePlanData {
  sleep?: CompletePlanItem;
  mind?: CompletePlanItem;
  treatment?: CompletePlanItem;
  routine?: CompletePlanItem;
  report?: CompletePlanItem;
  diet?: CompletePlanItem;
  movement?: CompletePlanItem;
}

export interface CompletePlanResponse {
  user_id: string;
  user_name: string;
  plan_data: CompletePlanData;
  metadata: {
    plan_summary: {
      total_plans: string;
      failed_plans: string[];
      successful_plans: string[];
    };
    version: string;
    execution_id: string;
  };
  created_at: string;
  updated_at: string;
  status: string;
  plan_type: string;
  plan_id: string;
}

// Plan generation status interfaces
export interface PlanGenerationJobStatus {
  user_id: string;
  status: 'processing' | 'no_plan' | 'has_plan' | 'generating';
  processing_job_id?: string;
  job_created_at?: string;
  message?: string;
  has_consolidated_plan?: boolean;
  has_legacy_plans?: boolean;
  estimated_completion?: string;
}

// User profile status interfaces
export interface UserProfileStatus {
  user_id: string;
  profile_status: 'complete' | 'partial' | 'empty';
  completed_tables: number;
  total_tables: number;
  completion_percentage: number;
  table_details: { [tableName: string]: boolean };
}

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiHost: string;

  constructor(
    private http: HttpClient,
    private configService: SuryaLibConfigService
  ) {
    this.apiHost = this.configService.apiHost;
  }

  /**
   * Get plan for current authenticated user
   */
  getPlan(): Observable<PlanResponse> {
    return this.http.get<PlanResponse>(`${this.apiHost}get-plan`);
  }

  /**
   * Get plan for specific user (admin only)
   */
  getPlanForUser(userId: string): Observable<PlanResponse> {
    return this.http.get<PlanResponse>(`${this.apiHost}get-plan?user=${userId}`);
  }

  /**
   * Get complete plan for current authenticated user
   */
  getCompletePlan(): Observable<CompletePlanResponse> {
    return this.http.get<CompletePlanResponse>(`${this.apiHost}get-complete-plan`);
  }

  /**
   * Get complete plan for specific user (admin only)
   */
  getCompletePlanForUser(userId: string): Observable<CompletePlanResponse> {
    return this.http.get<CompletePlanResponse>(`${this.apiHost}get-complete-plan?user_id=${userId}`);
  }

  /**
   * Generate complete plan for current authenticated user
   */
  generateCompletePlan(name: string): Observable<any> {
    return this.http.post(`${this.apiHost}generate-all-plans`, {
      name: name,
      plan_types: ["report", "sleep", "diet", "mind", "movement", "routine", "treatment"]
    });
  }

  /**
   * Generate complete plan for specific user (admin only)
   */
  generateCompletePlanForUser(userId: string, name: string): Observable<any> {
    return this.http.post(`${this.apiHost}generate-all-plans`, {
      user_id: userId,
      name: name,
      plan_types: ["report", "sleep", "diet", "mind", "movement", "routine", "treatment"]
    });
  }

  /**
   * Check if plan generation is in progress for current user
   */
  checkPlanGenerationStatus(): Observable<PlanGenerationJobStatus> {
    return this.http.get<PlanGenerationJobStatus>(`${this.apiHost}check-plan-creation`);
  }

  /**
   * Check if plan generation is in progress for specific user (admin only)
   */
  checkPlanGenerationStatusForUser(userId: string): Observable<PlanGenerationJobStatus> {
    return this.http.get<PlanGenerationJobStatus>(`${this.apiHost}check-plan-creation?user_id=${userId}`);
  }

  /**
   * Check profile completion status for current user
   */
  checkUserProfile(): Observable<UserProfileStatus> {
    return this.http.get<UserProfileStatus>(`${this.apiHost}check-user-profile`);
  }

  /**
   * Check profile completion status for specific user (admin only)
   */
  checkUserProfileForUser(userId: string): Observable<UserProfileStatus> {
    return this.http.get<UserProfileStatus>(`${this.apiHost}check-user-profile?user_id=${userId}`);
  }
}