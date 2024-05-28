import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { IMatch } from '../../../../core/models/interfaces/IMatch.interface';
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
  phases: string[] = [
    'Fase de grupos',
    'Cuartos de final',
    'Semifinal',
    'Partido por el tercer lugar',
    'Final',
  ];
  countries: ITeam[] = [];

  matches: IMatch[] = [];

  createMatchForm = this.fb.group({
    localTeam: ['', [Validators.required]],
    visitorTeam: ['', [Validators.required]],
    phase: ['', [Validators.required]],
    date: ['', [Validators.required]],
  });

  firstCountryOptions: ITeam[] = [...this.countries];
  secondCountryOptions: ITeam[] = [...this.countries];

  constructor() {}

  ngOnInit() {
    this.apiService.getNextMatches().subscribe({
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
    console.log(this.createMatchForm.value);
  }

  updateSecondCountryOptions(): void {
    const firstCountryValue = this.createMatchForm.get('localTeam')?.value;
    if (firstCountryValue) {
      this.secondCountryOptions = this.countries.filter(
        country => country.idteam !== parseInt(firstCountryValue)
      );
    }
  }

  updateFirstCountryOptions(): void {
    const secondCountryValue = this.createMatchForm.get('visitorTeam')?.value;
    if (secondCountryValue) {
      this.firstCountryOptions = this.countries.filter(
        country => country.idteam !== parseInt(secondCountryValue)
      );
    }
  }
}
