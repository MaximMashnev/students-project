import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule
],
  templateUrl: './authorization.html',
  styleUrls: ['./authorization.css']
})
export class Authorization implements AfterContentInit {
  form = new FormGroup({
    login: new FormControl(""),
    password: new FormControl("")
  })
  errorMessage: string = "";
  isError: boolean = false;

  constructor(
    private router: Router,
    private titleService: Title,
    private AuthService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    this.titleService.setTitle('Авторизация');
  }

  ngAfterContentInit(): void {
    const token = localStorage.getItem("Bearer");
    if (token) {
      this.router.navigate(['/main']);
    }
  }

  onLogin(): void {
    // TODO: изменить сохранение данных, т.к. localStorage можно легко редачить
    this.isError = false;
    console.log('Login attempt:', this.form.value.login, this.form.value.password!);

    this.AuthService.getToken(this.form.value.login!, this.form.value.password!).subscribe({
      next: (loginData) => {
        localStorage.setItem("Bearer", loginData.token);
        console.log('Login successful');
        console.log(loginData);
        Object.entries(loginData.data).forEach(
          ([key, value]) => localStorage.setItem(key, `${value}`)
        );
        this.router.navigate(['/main']);
      },
      error: (error) => {
        this.isError = true;
        this.setErrorText(error.error.message);
        this.cdr.detectChanges();
        console.error('Login failed', error);
      }
    });
  }

  setErrorText(error: string): void{
    if (error == "RESOURCE_INVALID_LOGIN_OR_PASSWORD") this.errorMessage = "Неверный логин или пароль";
    else this.errorMessage = error;
  }

  onRegister(): void {
    console.log("registration")
    this.router.navigate(['/registration']);
  }
}
