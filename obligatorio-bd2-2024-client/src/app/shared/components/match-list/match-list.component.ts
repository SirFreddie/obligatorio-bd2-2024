import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, inject } from '@angular/core';
import { IGame } from '../../../core/models/interfaces/IGame.interface';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { PredictionDialogComponent } from '../dialogs/prediction-dialog/prediction-dialog.component';
import { IPrediction } from '../../../core/models/interfaces/IPrediction.interface';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EventEmitter } from 'stream';
import { FlagService } from '../../../core/services/flag.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, ToastModule],
  providers: [
    DynamicDialogModule,
    DialogService,
    ApiService,
    MessageService,
    FlagService,
  ],
  templateUrl: './match-list.component.html',
  styleUrl: './match-list.component.scss',
})
export class MatchListComponent implements OnInit {
  @Input() games: IGame[] = [];
  predictions: IPrediction[] = [];

  dialogService: DialogService = inject(DialogService);
  apiService: ApiService = inject(ApiService);
  messageService: MessageService = inject(MessageService);
  flagService: FlagService = inject(FlagService);
  authService: AuthService = inject(AuthService);

  createPredictionRefDialog: DynamicDialogRef | undefined;
  updatePredictionRefDialog: DynamicDialogRef | undefined;
  updateGameDialog: DynamicDialogRef | undefined;

  ngOnInit(): void {
    if (this.authService.activeUser && this.authService.isStudent) {
      this.apiService
        .getUserPredictions(this.authService.activeUser?.user_id)
        .subscribe({
          next: predictions => (this.predictions = predictions),
        });
    }
  }

  createPrediction(game: IGame): void {
    this.createPredictionRefDialog = this.dialogService.open(
      PredictionDialogComponent,
      {
        header: 'Prediction',
        data: game,
      }
    );

    this.createPredictionRefDialog.onClose.subscribe({
      next: (prediction: IPrediction) => {
        if (prediction) {
          this.apiService.createPrediction(prediction).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Confirmed',
                detail: 'Prediction done!.',
                life: 3000,
              });
            },
            error: err => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message,
                life: 3000,
              });
            },
          });
        }
      },
    });
  }

  updatePrediction(game: IGame) {
    this.updatePredictionRefDialog = this.dialogService.open(
      PredictionDialogComponent,
      {
        header: 'Prediction',
        data: game,
      }
    );

    this.updatePredictionRefDialog.onClose.subscribe({
      next: (prediction: IPrediction) => {
        if (prediction) {
          this.apiService.updatePrediction(prediction).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Confirmed',
                detail: 'Prediction updated!.',
                life: 3000,
              });
            },
            error: err => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message,
                life: 3000,
              });
            },
          });
        }
      },
    });
  }

  updateGame(game: IGame) {
    this.updateGameDialog = this.dialogService.open(PredictionDialogComponent, {
      header: 'Set Game Results',
      data: game,
    });

    this.updateGameDialog.onClose.subscribe({
      next: game => {
        if (game) {
          this.apiService.updateGame(game).subscribe({
            next: response => {
              this.messageService.add({
                severity: 'success',
                summary: 'Confirmed',
                detail: response.message,
                life: 3000,
              });
            },
            error: err => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error.message,
                life: 3000,
              });
            },
          });
        }
      },
    });
  }

  checkIfCanPredict(game: IGame): boolean {
    // Get the current date and time
    const currentDate = new Date();

    // Get the date and time of the game
    const gameDate = new Date(game.date);

    // Calculate the cutoff time for predictions (1 hour before the game)
    const cutoffTime = new Date(gameDate.getTime() - 60 * 60 * 1000);

    // Return true if the current date is before the cutoff time, the game has no results, and the user can predict
    return (
      currentDate < cutoffTime &&
      !this.hasResults(game) &&
      this.authService.isStudent
    );
  }

  checkIfCanEdit(game: IGame): boolean {
    return this.hasResults(game) && this.authService.isAdmin;
  }

  hasResults(game: IGame): boolean {
    return game.scoreLocale !== null && game.scoreVisitor !== null;
  }

  getFlagUrl(teamCode: string): string {
    return this.flagService.getFlagUrl(teamCode);
  }

  getPrediction(game: IGame): IPrediction | undefined {
    return this.predictions.find(
      p =>
        p.stage === game.stage &&
        p.team_id_local === game.teamLocale &&
        p.team_id_visitor === game.teamVisitor
    );
  }

  getPredictionColor(score: number, prediction: number): string {
    if (score === null || prediction === null) {
      return 'text-warning-emphasis';
    } else if (score === prediction) {
      return 'text-success-emphasis';
    } else if (score !== prediction) {
      return 'text-danger-emphasis';
    } else {
      return 'text-warning-emphasis';
    }
  }
}
