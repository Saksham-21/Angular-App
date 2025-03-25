import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  apiUrl = 'http://localhost:8000/auth/login';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const formData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    console.log('Form data', formData);
    this.http.post<{ role: string; access_token: string }>(this.apiUrl, formData).subscribe(
      (response) => {
        console.log('Login Successful', response);
        localStorage.setItem('userRole', response.role);
        localStorage.setItem('access_token', response.access_token);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }
}
