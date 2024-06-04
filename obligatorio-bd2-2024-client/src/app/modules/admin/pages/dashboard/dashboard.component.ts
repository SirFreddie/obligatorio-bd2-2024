import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { IGame } from '../../../../core/models/interfaces/IGame.interface';
import { ApiService } from '../../../../core/services/api.service';
import { MatchListComponent } from '../../../../shared/components/match-list/match-list.component';
import { ITeam } from '../../../../core/models/interfaces/ITeam.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    MatchListComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent implements OnInit {
  fb = inject(FormBuilder);
  apiService: ApiService = inject(ApiService);

  minDate = new Date();
  stages: string[] = [
    'Fase de grupos',
    'Cuartos de final',
    'Semifinal',
    'Partido por el tercer lugar',
    'Final',
  ];
  countries: ITeam[] = [];

  matches: IGame[] = [];

  createMatchForm = this.fb.group({
    localTeam: ['', [Validators.required]],
    visitorTeam: ['', [Validators.required]],
    stage: ['', [Validators.required]],
    date: ['', [Validators.required]],
  });

  firstCountryOptions: ITeam[] = [...this.countries];
  secondCountryOptions: ITeam[] = [...this.countries];

  constructor() {}

  ngOnInit() {
    this.apiService.getNextGames().subscribe({
      next: matches => {
        this.matches = matches;
      },
    });
    this.apiService.getTeams().subscribe({
      next: teams => {
        this.countries = teams;
        this.firstCountryOptions = [...this.countries];
        this.secondCountryOptions = [...this.countries];
      },
    });
  }

  createMatch(): void {
    this.apiService.createGame(this.createMatchForm.value).subscribe({
      next: () => {
        this.apiService.getNextGames().subscribe({
          next: matches => {
            this.matches = matches;
            this.createMatchForm.reset();
          },
        });
      },
    });
  }

  updateSecondCountryOptions(): void {
    const firstCountryValue = this.createMatchForm.get('localTeam')?.value;
    if (firstCountryValue) {
      this.secondCountryOptions = this.countries.filter(
        country => country.team_id !== firstCountryValue
      );
    }
  }

  updateFirstCountryOptions(): void {
    const secondCountryValue = this.createMatchForm.get('visitorTeam')?.value;
    if (secondCountryValue) {
      this.firstCountryOptions = this.countries.filter(
        country => country.team_id !== secondCountryValue
      );
    }
  }
}
