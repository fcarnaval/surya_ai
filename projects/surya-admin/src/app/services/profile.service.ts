import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuryaLibConfigService } from 'surya-lib/lib/surya-lib-config.service';

export interface ProfileUser {
  user_id: string;
  email: string;
  name: string;
  profile_status: 'complete' | 'partial' | 'empty' | string;
}

export interface ListProfileUsersResponse {
  users: ProfileUser[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: SuryaLibConfigService
  ) {
    const config = this.configService.getConfig();
    this.baseUrl = config?.apiHost || 'http://localhost:3000/';
  }

  listProfileUsers(): Observable<ProfileUser[]> {
    return this.http
      .get<ListProfileUsersResponse>(`${this.baseUrl}list-profile-users`)
      .pipe(map((res) => res.users));
  }
}



