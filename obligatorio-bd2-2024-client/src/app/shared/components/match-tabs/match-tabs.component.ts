import {
  Component,
  Input,
  OnInit,
  computed,
  model,
  signal,
} from '@angular/core';
import { IGame } from '../../../core/models/interfaces/IGame.interface';
import { STAGES } from '../../helpers/constants';
import { TabViewModule } from 'primeng/tabview';
import { MatchListComponent } from '../match-list/match-list.component';

@Component({
  selector: 'app-match-tabs',
  standalone: true,
  imports: [TabViewModule, MatchListComponent],
  templateUrl: './match-tabs.component.html',
  styleUrl: './match-tabs.component.scss',
})
export class MatchTabsComponent {
  games = model<IGame[]>();
  stages: string[] = STAGES;
  displayedGames = computed(() => this.games());

  getGamesByStage(stage: string): IGame[] {
    return this.displayedGames()!.filter(game => game.stage === stage);
  }
}
