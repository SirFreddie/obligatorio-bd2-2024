import { Routes } from '@angular/router';
import { FixtureComponent } from './fixture/fixture.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

export const HOME_ROUTES: Routes = [
  { path: 'fixture', component: FixtureComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
];
