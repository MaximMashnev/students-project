import { AuthService } from './../../services/auth-service';
import { Title } from '@angular/platform-browser';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
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
export class MainPage implements OnInit {
  name!: string;
  surname!: string;
  patronymic!: string;
  role = localStorage.getItem("role");
  userData!: User;

  constructor(
    private router: Router,
    private titleService: Title,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    this.titleService.setTitle("Главная страница")
  }

  ngOnInit(): void {
    this.isLogin();
    this.getFIO();
  }

  isLogin () {
    const token = localStorage.getItem("Bearer");
    if (!token) {
      this.router.navigate(['/auth']);
    }
  }

  logoutUser() {
    localStorage.clear();
  }

  //можно попробовать вынести в новый сервис
  hasRole(role: string) {
    return localStorage.getItem('role') === role;
  }

  getFIO () {
    this.authService.getMyInfo().subscribe(data => {
      this.name = data[0].name;
      this.surname = data[0].surname;
      this.patronymic = data[0].patronymic;
      this.cdr.detectChanges();
    });
  }
}
