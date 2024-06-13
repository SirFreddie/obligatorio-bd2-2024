import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { IUser } from '../models/interfaces/IUser.interface';

import { HttpClient } from '@angular/common/http';
import { ITeam } from '../models/interfaces/ITeam.interface';
import { IGame } from '../models/interfaces/IGame.interface';
import { IPrediction } from '../models/interfaces/IPrediction.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);

  baseUrl = 'http://localhost:3000/api';

  constructor() {}

  getUsers(): Observable<IUser[]> {
    return of([]);
  }

  getNextGames(): Observable<IGame[]> {
    return this.http.get(`${this.baseUrl}/games`).pipe(
      map((res: any) => {
        const games = res.data.map((game: any) => {
          return {
            date: new Date(game.date),
            teamLocale: game.team_id_local,
            teamVisitor: game.team_id_visitor,
            scoreLocale: game.local_result,
            scoreVisitor: game.visitor_result,
            stage: game.stage,
            teamLocaleCode: game.teamLocaleCode,
            teamVisitorCode: game.teamVisitorCode,
          };
        });
        return games;
      })
    );
  }

  getUserPoints(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/users/points`)
      .pipe(map((res: any) => res.data));
  }

  getTeams(): Observable<ITeam[]> {
    return this.http
      .get(`${this.baseUrl}/teams`)
      .pipe(map((res: any) => res.data));
  }

  createGame(game: any): Observable<any> {
    const newGame = {
      stage: game.stage,
      team_id_local: game.localTeam,
      team_id_visitor: game.visitorTeam,
      date: game.date,
    };
    return this.http.post(`${this.baseUrl}/games/new`, newGame);
  }

  updateGame(game: IGame): Observable<any> {
    return this.http.put(`${this.baseUrl}/games`, game);
  }

  createPrediction(prediction: IPrediction): Observable<any> {
    return this.http.post(`${this.baseUrl}/predictions/new`, prediction);
  }

  getUserPredictions(userId: number): Observable<IPrediction[]> {
    return this.http
      .get(`${this.baseUrl}/predictions/${userId}`)
      .pipe(map((res: any) => res.data));
  }
}
