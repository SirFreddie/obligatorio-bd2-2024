import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/interfaces/IUser.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private apiUrl = 'http://localhost:3000/api';


  constructor(private http: HttpClient) { }

  createUser(user: IUser): Observable<IUser> {
    
    return this.http.post<IUser>(`${this.apiUrl}/users/new`, user);
  }
}
