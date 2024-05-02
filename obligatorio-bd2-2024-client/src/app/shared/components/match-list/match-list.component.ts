import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IMatch } from '../../../core/models/interfaces/IMatch.interface';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-list.component.html',
  styleUrl: './match-list.component.scss',
})
export class MatchListComponent {
  @Input() matches: IMatch[] = [];
  @Input() canEdit: boolean = false;
  @Input() canPredict: boolean = false;
}
