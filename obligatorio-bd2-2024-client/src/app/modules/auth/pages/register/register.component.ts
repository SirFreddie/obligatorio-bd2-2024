import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegistroService } from '../../../../core/services/registro.service';
import {
  IStudent,
  IUser,
} from '../../../../core/models/interfaces/IUser.interface';
import { ApiService } from '../../../../core/services/api.service';
import { ITeam } from '../../../../core/models/interfaces/ITeam.interface';
import { NgFor, NgForOf } from '@angular/common';
import { MatchListComponent } from '../../../../shared/components/match-list/match-list.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgForOf,
    MatchListComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export default class RegisterComponent implements OnInit {
  apiService: ApiService = inject(ApiService);
  fb = inject(FormBuilder);
  messageService: MessageService = inject(MessageService);

  countries: ITeam[] = [];
  firstCountryOptions: ITeam[] = [...this.countries];
  secondCountryOptions: ITeam[] = [...this.countries];
  careers: any[] = [];
  formulario: FormGroup;

  createMatchForm = this.fb.group({
    campeon: ['', [Validators.required]],
    subcampeon: ['', [Validators.required]],
  });

  constructor(private registroService: RegistroService) {
    this.formulario = new FormGroup({
      user_id: new FormControl(),
      name: new FormControl(),
      surname: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
      career: new FormControl(''),
      first_place_prediction: new FormControl(''),
      second_place_prediction: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.apiService.getTeams().subscribe({
      next: teams => {
        this.countries = teams;
        this.firstCountryOptions = [...this.countries];
        this.secondCountryOptions = [...this.countries];
      },
    });

    this.apiService.getCareers().subscribe({
      next: careers => {
        this.careers = careers;
      }
    })
  }

  onSubmit() {
    if (this.formulario?.valid) {
      const usuario: IStudent = {
        user_id: this.formulario.value.user_id,
        name: this.formulario.value.name,
        surname: this.formulario.value.surname,
        email: this.formulario.value.email,
        password: this.formulario.value.password,
        career: this.formulario.value.career,
        first_place_prediction: this.formulario.value.first_place_prediction,
        second_place_prediction: this.formulario.value.second_place_prediction,
      };
      this.registroService.createUser(usuario).subscribe({
        next: user => {
          this.limpiar();
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmed',
            detail: 'Usuario creado correctamente.',
            life: 3000,
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
  }

  limpiar() {
    this.formulario?.reset();
  }

  updateSecondCountryOptions(): void {
    const firstCountryValue = this.createMatchForm.get('subcampeon')?.value;
    if (firstCountryValue) {
      this.secondCountryOptions = this.countries.filter(
        country => country.team_id !== firstCountryValue
      );
    }
  }

  updateFirstCountryOptions(): void {
    const secondCountryValue = this.createMatchForm.get('campeon')?.value;
    if (secondCountryValue) {
      this.firstCountryOptions = this.countries.filter(
        country => country.team_id !== secondCountryValue
      );
    }
  }


}
