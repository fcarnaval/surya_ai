import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiHost = environment.apiHost;

  constructor(private http: HttpClient) { }

  public getUserInfo(): Observable<any> {

    return new Observable<any>((observer) => {
      this.http.get(this.apiHost + "user-info").subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });

  }

}
