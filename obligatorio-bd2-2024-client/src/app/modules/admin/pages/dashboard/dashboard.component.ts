import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { IGame } from '../../../../core/models/interfaces/IGame.interface';
import { ApiService } from '../../../../core/services/api.service';
import { MatchListComponent } from '../../../../shared/components/match-list/match-list.component';
import { ITeam } from '../../../../core/models/interfaces/ITeam.interface';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { STAGES } from '../../../../shared/helpers/constants';
import { MatchTabsComponent } from '../../../../shared/components/match-tabs/match-tabs.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    MatchListComponent,
    ConfirmDialogModule,
    ToastModule,
    MatchTabsComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent implements OnInit {
  fb = inject(FormBuilder);
  apiService: ApiService = inject(ApiService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);

  minDate = new Date();
  stages: string[] = STAGES;
  countries: ITeam[] = [];

  games: IGame[] = [];

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
    this.getGames();
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
          next: games => {
            this.games = games;
            this.createMatchForm.reset();
            this.firstCountryOptions = [...this.countries];
            this.secondCountryOptions = [...this.countries];
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmed',
              detail: 'Partido creado!.',
              life: 3000,
            });
          },
        });
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 3000,
        });
      },
    });
  }

  openCreateMatchDialog(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        'Ests seguro de que deseas continuar? \nEsta accion no se puede deshacer y hara que el juego sea visible.',
      header: 'Confirmation',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.createMatch();
      },
      reject: () => {},
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

  getGames() {
    this.apiService.getNextGames().subscribe({
      next: games => {
        this.games = games;
      },
    });
  }
}
