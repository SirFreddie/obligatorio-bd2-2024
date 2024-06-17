import { Injectable } from '@angular/core';
import { IStudent, IUser } from '../models/interfaces/IUser.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'http://localhost:3000/api';

  private _activeUser: IStudent | null = null;

  get activeUser(): IStudent | null {
    return this._activeUser;
  }

  get isStudent(): boolean {
    return this._activeUser?.role === 'student';
  }

  get isAdmin(): boolean {
    return this._activeUser?.role === 'admin';
  }

  constructor(private http: HttpClient) {}

  register(user: IStudent) {
    return this.http.post<IStudent>(`${this.baseUrl}/users/new`, user);
  }

  login(email: string, password: string) {
    const body = { email, password };
    return this.http.post<any>(`${this.baseUrl}/users/login`, body).pipe(
      tap(res => {
        if (res.ok) {
          this._activeUser = res.data.user;
          localStorage.setItem('token', res.data.token);
        }
      })
    );
  }

  logout() {
    const headers = new HttpHeaders().set(
      'Authorization',
      `${localStorage.getItem('token') || ''}`
    );
    localStorage.removeItem('token');
    this._activeUser = null;
    // const options = { headers: headers };
    // return this.http.post(`${this.baseUrl}/users/logout`, null, options);
  }

  validateToken() {
    if (typeof localStorage === 'undefined') {
      return of(false);
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `${localStorage.getItem('token') || ''}`
    );
    const options = { headers: headers };

    if (!localStorage.getItem('token')) {
      return of(false);
    }

    return this.http.post(`${this.baseUrl}/users/renew`, null, options).pipe(
      map((res: any) => {
        if (res.ok) {
          this._activeUser = res.data.user;
          localStorage.setItem('token', res.data.token);
          return true;
        }
        return false;
      }),
      catchError(err => of(false))
    );
  }
}
