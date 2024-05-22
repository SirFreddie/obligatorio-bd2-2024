import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { UsersMock } from '../models/mocks/User.mock';
import { IUser } from '../models/interfaces/IUser.interface';
import { IMatch } from '../models/interfaces/IMatch.interface';
import { NextMatchesMock } from '../models/mocks/Match.mock';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);

  baseUrl = 'http://localhost:3000/api';

  constructor() {}

  getUsers(): Observable<IUser[]> {
    return of(UsersMock);
  }

  getNextMatches(): Observable<IMatch[]> {
    return of(NextMatchesMock);
  }

  getUserPoints(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/users/points`)
      .pipe(map((res: any) => res.data));
  }
}
