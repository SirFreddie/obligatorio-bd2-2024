import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IGame } from '../../../../core/models/interfaces/IGame.interface';
import { IPrediction } from '../../../../core/models/interfaces/IPrediction.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-prediction-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prediction-dialog.component.html',
  styleUrl: './prediction-dialog.component.scss',
})
export class PredictionDialogComponent {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  localResult: FormControl = new FormControl(0, [
    Validators.required,
    Validators.min(0),
  ]);
  visitorResult: FormControl = new FormControl(0, [
    Validators.required,
    Validators.min(0),
  ]);

  game!: IGame;

  prediction: IPrediction | null = null;

  ngOnInit() {
    this.game = this.config.data;
  }

  close(confirm: boolean) {
    if (!this.game) return;
    if (!confirm) {
      this.ref.close();
      return;
    }
    const newPrediction: IPrediction = {
      team_id_local: this.game.teamLocale,
      local_result: this.localResult.value,
      team_id_visitor: this.game.teamVisitor,
      visitor_result: this.visitorResult.value,
      stage: this.game.stage,
    };
    this.ref.close(newPrediction);
    return;
  }
}
