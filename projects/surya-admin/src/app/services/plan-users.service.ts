import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuryaLibConfigService } from 'surya-lib/lib/surya-lib-config.service';

export interface PlanInfo {
  created_at: string;
  updated_at: string;
  has_content: boolean;
  content_length: number;
  summary: string;
  status: string;
  job_id?: string;
  total_sleep_plans?: number;
}

export interface CompletePlanInfo extends PlanInfo {
  specific_plans?: {
    [key: string]: number;
    report: number;
    sleep: number;
    diet: number;
    mind: number;
    movement: number;
    routine: number;
    treatment: number;
  };
}

export interface PlanUser {
  user_id: string;
  username: string;
  email: string;
  name: string;
  phone: string;
  user_type: string;
  app_user: boolean;
  is_admin: boolean;
  status: string;
  created_date: string;
  last_modified_date: string;
  // Overall plan status
  has_plan: boolean;
  plan_status: string; // 'no_plan', 'has_plan', 'plan_empty', 'processing'
  // Plan type flags
  has_simplified_plan: boolean;
  has_complete_plan: boolean;
  // Plan information for each type
  simplified_plan_info?: PlanInfo;
  complete_plan_info?: CompletePlanInfo;
  // Legacy field for backward compatibility
  plan_info?: PlanInfo;
}

export interface PlanUsersResponse {
  users: PlanUser[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlanUsersService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: SuryaLibConfigService
  ) {
    const config = this.configService.getConfig();
    this.baseUrl = config?.apiHost || 'http://localhost:3000';
  }

  getPlanUsers(): Observable<PlanUser[]> {
    return this.http.get<PlanUsersResponse>(`${this.baseUrl}list-plan-users`).pipe(
      map(response => response.users)
    );
  }

  createSimplifiedPlan(userId: string, name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}generate-all-plans`, {
      user_id: userId,
      name: name,
      plan_types: ["general"]
    });
  }

  createCompletePlan(userId: string, name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}generate-all-plans`, {
      user_id: userId,
      name: name,
      plan_types: ["report", "sleep", "diet", "mind", "movement", "routine", "treatment"]
    });
  }

  recreateSimplifiedPlan(userId: string, name: string): Observable<any> {
    return this.createSimplifiedPlan(userId, name);
  }

  recreateCompletePlan(userId: string, name: string): Observable<any> {
    return this.createCompletePlan(userId, name);
  }

  getCompletePlan(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}get-complete-plan?user_id=${userId}`);
  }
}