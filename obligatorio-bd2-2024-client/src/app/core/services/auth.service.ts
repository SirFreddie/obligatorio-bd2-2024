import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000/api';

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, {
      email,
      password,
    });
  }
}
