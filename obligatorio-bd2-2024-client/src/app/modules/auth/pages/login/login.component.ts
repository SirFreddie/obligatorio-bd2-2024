import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    this.authService
      .login(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      )
      .subscribe(
        res => {
          if (res.ok) {
            console.log('Login successful');
            this.router.navigate(['/home']);
          } else {
            console.log('Login failed');
          }
        },
        err => {
          console.error(err);
        }
      );
  }
}
