import { CommonModule } from '@angular/common';
import { Component, Input, Output, inject } from '@angular/core';
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

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, ToastModule],
  providers: [DynamicDialogModule, DialogService, ApiService, MessageService],
  templateUrl: './match-list.component.html',
  styleUrl: './match-list.component.scss',
})
export class MatchListComponent {
  @Input() games: IGame[] = [];
  @Input() canEdit: boolean = false;
  @Input() canPredict: boolean = false;

  dialogService: DialogService = inject(DialogService);
  apiService: ApiService = inject(ApiService);
  messageService: MessageService = inject(MessageService);

  predictionRedDialog: DynamicDialogRef | undefined;
  updateGameDialog: DynamicDialogRef | undefined;

  createPrediction(game: IGame): void {
    this.predictionRedDialog = this.dialogService.open(
      PredictionDialogComponent,
      {
        header: 'Prediction',
        data: game,
      }
    );

    this.predictionRedDialog.onClose.subscribe({
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
      currentDate < cutoffTime && !this.hasResults(game) && this.canPredict
    );
  }

  checkIfCanEdit(game: IGame): boolean {
    return this.hasResults(game) && this.canEdit;
  }

  hasResults(game: IGame): boolean {
    return game.scoreLocale !== null && game.scoreVisitor !== null;
  }
}
