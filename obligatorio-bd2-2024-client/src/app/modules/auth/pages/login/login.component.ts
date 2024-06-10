import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  constructor(private auth:AuthService) {}

  email: string= '' ;
  password: string= '' ;

  login(){
    const user = {email: this.email, password: this.password};
    this.auth.login(user.email,user.password).subscribe((res) => {
      console.log(res);
    });
  }






}
