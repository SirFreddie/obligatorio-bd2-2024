import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IGame } from '../../../core/models/interfaces/IGame.interface';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-list.component.html',
  styleUrl: './match-list.component.scss',
})
export class MatchListComponent {
  @Input() matches: IGame[] = [];
  @Input() canEdit: boolean = false;
  @Input() canPredict: boolean = false;
}
