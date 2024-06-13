import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IGame } from '../../../../core/models/interfaces/IGame.interface';
import { ApiService } from '../../../../core/services/api.service';
import { MatchListComponent } from '../../../../shared/components/match-list/match-list.component';
import { STAGES } from '../../../../shared/helpers/constants';
import { MatchTabsComponent } from '../../../../shared/components/match-tabs/match-tabs.component';
import { AuthService } from '../../../../core/services/auth.service';
import { IPrediction } from '../../../../core/models/interfaces/IPrediction.interface';

@Component({
  selector: 'app-fixture',
  standalone: true,
  imports: [CommonModule, MatchListComponent, MatchTabsComponent],
  templateUrl: './fixture.component.html',
  styleUrl: './fixture.component.scss',
})
export default class FixtureComponent implements OnInit {
  apiService: ApiService = inject(ApiService);
  authService: AuthService = inject(AuthService);

  games: IGame[] = [];
  predictions: IPrediction[] = [];

  ngOnInit(): void {
    this.apiService.getNextGames().subscribe({
      next: games => {
        this.games = games;
      },
    });
  }
}
