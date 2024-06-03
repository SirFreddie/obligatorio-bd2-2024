import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegistroService } from '../../../../core/services/registro.service';
import { IUser } from '../../../../core/models/interfaces/IUser.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export default class RegisterComponent {

  formulario: FormGroup;
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
      this.registroService.registrarUsuario(usuario).toPromise().then(() => {
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

}