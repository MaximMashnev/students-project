import { Title } from '@angular/platform-browser';
import { Component} from '@angular/core';
import { Router, RouterOutlet, RouterLinkActive, RouterLinkWithHref} from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { User } from '../../models/user';

@Component({
  selector: 'app-main-page',
  imports: [RouterOutlet, MatIconModule, MatButtonModule, RouterLinkActive, RouterLinkWithHref],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {
  name = localStorage.getItem("name");
  surname = localStorage.getItem("surname");
  patronymic = localStorage.getItem("patronymic");
  role = localStorage.getItem("role");
  userData!: User;

  constructor(
    private router: Router,
    private titleService: Title,
  ) {
    this.titleService.setTitle("Главная страница")
    this.isLogin();
  }

  isLogin () {
    const token = localStorage.getItem("Bearer");
    //  TODO: перебрасывать на страницу с авторизацией, если токен равен undefined
    if (!token) {
      this.router.navigate(['/auth']);
    }
  }

  logoutUser() {
    localStorage.removeItem("Bearer");
    localStorage.clear();
  }

  //можно попробовать вынести в новый сервис
  hasRole(role: string) {
    return localStorage.getItem('role') === role;
  }
}
