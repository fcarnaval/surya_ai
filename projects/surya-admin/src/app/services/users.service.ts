import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuryaLibConfigService } from 'surya-lib/lib/surya-lib-config.service';

export interface CognitoUser {
  user_id: string;
  username: string;
  email: string;
  name: string;
  phone: string;
  user_type: string;
  app_user: boolean;
  is_admin: boolean;
  status: string;
  expired: boolean;
  created_date: string;
  last_modified_date: string;
}

export interface UsersResponse {
  users: CognitoUser[];
  total_count: number;
}

export interface RenewPasswordRequest {
  user_id: string;
}

export interface RenewPasswordResponse {
  message: string;
  user_id: string;
  renewed_at: string;
  status: string;
  expires_at: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  phone?: string;
  appUser: boolean;
  force_password_change: boolean;
}

export interface CreateUserResponse {
  message: string;
  user: {
    user_id: string;
    email: string;
    name: string;
    phone?: string;
    status: string;
    app_user: boolean;
    email_verified: boolean;
    created_date: string;
  };
}

export interface GrantAppAccessRequest {
  user_id: string;
  force_password_change: boolean;
}

export interface GrantAppAccessResponse {
  message: string;
  user: {
    user_id: string;
    email: string;
    name: string;
    phone?: string;
    status: string;
    app_user: boolean;
    email_verified: boolean;
    created_date: string;
    cognito_sub: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: SuryaLibConfigService
  ) {
    const config = this.configService.getConfig();
    this.baseUrl = config?.apiHost || 'http://localhost:3000';
  }

  getUsers(): Observable<CognitoUser[]> {
    return this.http.get<UsersResponse>(`${this.baseUrl}get-users`).pipe(
      map(response => response.users)
    );
  }

  renewPassword(userId: string): Observable<RenewPasswordResponse> {
    const payload: RenewPasswordRequest = { user_id: userId };
    return this.http.post<RenewPasswordResponse>(`${this.baseUrl}renew-password`, payload);
  }

  createUser(email: string, name: string, phone: string, appUser: boolean, forcePasswordChange: boolean): Observable<CreateUserResponse> {
    const payload: CreateUserRequest = { email, name, phone, appUser, force_password_change: forcePasswordChange };
    return this.http.post<CreateUserResponse>(`${this.baseUrl}create-user`, payload);
  }

  grantAppAccess(userId: string, forcePasswordChange: boolean): Observable<GrantAppAccessResponse> {
    const payload: GrantAppAccessRequest = { user_id: userId, force_password_change: forcePasswordChange };
    return this.http.post<GrantAppAccessResponse>(`${this.baseUrl}grant-app-access`, payload);
  }
}
