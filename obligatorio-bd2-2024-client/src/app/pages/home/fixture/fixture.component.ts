import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IMatch } from '../../../core/models/interfaces/IMatch.interface';
import { ApiService } from '../../../core/services/api.service';
import { MatchListComponent } from '../../../shared/components/match-list/match-list.component';

@Component({
  selector: 'app-fixture',
  standalone: true,
  imports: [CommonModule, MatchListComponent],
  templateUrl: './fixture.component.html',
  styleUrl: './fixture.component.scss',
})
export class FixtureComponent implements OnInit {
  apiService: ApiService = inject(ApiService);

  matches: IMatch[] = [];

  ngOnInit(): void {
    this.apiService.getNextMatches().subscribe({
      next: matches => {
        this.matches = matches;
      },
    });
  }
}
