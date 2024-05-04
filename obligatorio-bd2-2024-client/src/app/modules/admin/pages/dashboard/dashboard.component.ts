import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { IMatch } from '../../../../core/models/interfaces/IMatch.interface';
import { ApiService } from '../../../../core/services/api.service';
import { MatchListComponent } from '../../../../shared/components/match-list/match-list.component';

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
  countries: { code: string; name: string }[] = [
    { code: 'ARG', name: 'Argentina' },
    { code: 'BRA', name: 'Brasil' },
    { code: 'CHI', name: 'Chile' },
    { code: 'COL', name: 'Colombia' },
    { code: 'ECU', name: 'Ecuador' },
    { code: 'PAR', name: 'Paraguay' },
    { code: 'PER', name: 'Peru' },
    { code: 'URU', name: 'Uruguay' },
    { code: 'VEN', name: 'Venezuela' },
  ];

  matches: IMatch[] = [];

  createMatchForm = this.fb.group({
    localTeam: ['', [Validators.required]],
    visitorTeam: ['', [Validators.required]],
    phase: ['', [Validators.required]],
    date: ['', [Validators.required]],
  });

  firstCountryOptions: { code: string; name: string }[] = [...this.countries];
  secondCountryOptions: { code: string; name: string }[] = [...this.countries];

  constructor() {}

  ngOnInit() {
    this.apiService.getNextMatches().subscribe({
      next: matches => {
        this.matches = matches;
      },
    });
  }

  createMatch(): void {
    console.log(this.createMatchForm.value);
  }

  updateSecondCountryOptions(): void {
    const firstCountryValue = this.createMatchForm.get('localTeam')?.value;
    this.secondCountryOptions = this.countries.filter(
      country => country.code !== firstCountryValue
    );
  }

  updateFirstCountryOptions(): void {
    const secondCountryValue = this.createMatchForm.get('visitorTeam')?.value;
    this.firstCountryOptions = this.countries.filter(
      country => country.code !== secondCountryValue
    );
  }
}
