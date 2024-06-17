import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { IGame } from '../../../core/models/interfaces/IGame.interface';
import { STAGES } from '../../helpers/constants';
import { TabViewModule } from 'primeng/tabview';
import { MatchListComponent } from '../match-list/match-list.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-match-tabs',
  standalone: true,
  imports: [TabViewModule, MatchListComponent],
  templateUrl: './match-tabs.component.html',
  styleUrl: './match-tabs.component.scss',
})
export class MatchTabsComponent implements OnInit {
  apiService: ApiService = inject(ApiService);

  games = model<IGame[]>([]);
  stages: string[] = STAGES;
  displayedGames = computed(() => this.games());

  ngOnInit() {
    this.getGames();
  }

  getGamesByStage(stage: string): IGame[] {
    return this.displayedGames()!.filter(game => game.stage === stage);
  }

  getGames() {
    this.apiService.getNextGames().subscribe({
      next: (games: IGame[]) => {
        this.games.set(games);
      },
    });
  }
}
