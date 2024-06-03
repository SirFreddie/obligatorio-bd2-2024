import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/interfaces/IUser.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private apiUrl = 'http://localhost:3000/usuarios';


  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: IUser){
    return this.http.post(this.apiUrl, usuario);
  }
}
