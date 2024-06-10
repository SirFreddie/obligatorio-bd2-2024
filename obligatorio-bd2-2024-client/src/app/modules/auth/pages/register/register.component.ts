import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RegistroService } from '../../../../core/services/registro.service';
import { IUser } from '../../../../core/models/interfaces/IUser.interface';
import { ApiService } from '../../../../core/services/api.service';
import { ITeam } from '../../../../core/models/interfaces/ITeam.interface';
import { NgFor,NgForOf } from '@angular/common';
import { MatchListComponent } from '../../../../shared/components/match-list/match-list.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ 
    FormsModule,
    ReactiveFormsModule,NgFor,NgForOf,MatchListComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export default class RegisterComponent implements OnInit{

  apiService: ApiService = inject(ApiService);

  countries: ITeam[] = [];
  firstCountryOptions: ITeam[] = [...this.countries];
  secondCountryOptions: ITeam[] = [...this.countries];
  formulario: FormGroup;
  fb = inject(FormBuilder);

  createMatchForm = this.fb.group({
    campeon: ['', [Validators.required]],
    subcampeon: ['', [Validators.required]],
  });

  

  constructor(private registroService: RegistroService) { 

    this.formulario = new FormGroup({
      nombre: new FormControl(),
      apellido: new FormControl(),
      cedula: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
      campeon: new FormControl(),
      subcampeon: new FormControl()
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
  }

  onSubmit() {
    if (this.formulario?.valid) {

    const usuario:IUser = {
      nombre: this.formulario.value.nombre,
      apellido: this.formulario.value.apellido,
      cedula: this.formulario.value.cedula,
      email: this.formulario.value.email,
      password: this.formulario.value.password,
      campeon: this.formulario.value.campeon,
      subcampeon: this.formulario.value.subcampeon
    };
      this.registroService.createUser(usuario).toPromise().then(() => {
        console.log('Usuario registrado');
        this.limpiar();
        
      }).catch((error) => {
        console.error('Error al registrar usuario', error);
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