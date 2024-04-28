import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UsersMock } from '../models/mocks/User.mock';
import { IUser } from '../models/interfaces/IUser.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  getUsers(): Observable<IUser[]> {
    return of(UsersMock);
  }
}
