import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration implements OnInit {

  constructor(private AuthService: AuthService,
    private router: Router, private TitleService: Title) {
    this.TitleService.setTitle('Регистрация')
  }

  ngOnInit(): void {
    const token = localStorage.getItem("Bearer");
    if (token) {
      this.router.navigate(['/main']);
    }
  }

  form = new FormGroup({
    name: new FormControl(""),
    surname: new FormControl(""),
    patronymic: new FormControl(""),
    phoneNumber: new FormControl(""),

    login: new FormControl(""),
    password: new FormControl("")
  })

  OnSubmit(): void {
    console.log(this.form.value);
    this.AuthService.registerUser(this.form.value.login!, this.form.value.password!,
      this.form.value.name!, this.form.value.surname!,
       this.form.value.patronymic!, this.form.value.phoneNumber!).subscribe({
      next: (loginData) => {
        localStorage.setItem("Bearer", loginData.token);
        console.log('Login successful');

        this.router.navigate(['/main']);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

  onLogin(): void {
    this.router.navigate(['/auth']);
  }
}
