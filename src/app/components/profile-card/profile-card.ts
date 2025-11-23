import { User } from './../../models/user';
import { Component} from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-profile-card',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.css',
})
export class ProfileCard {
  userData!: any;

  constructor(private router: Router, private titleService: Title, private authService: AuthService) {
    this.titleService.setTitle('Профиль');
    this.setLocalStorage();
  }

  setLocalStorage() {
    if (localStorage.getItem("username")) {
      this.userData = new User();
      for (let key in localStorage) {
        if (localStorage.getItem(key) != null) {
          this.userData[key] = localStorage.getItem(key);
        }
      }
      this.authService.getMyInfo().subscribe({
        next: (data) => {
          console.log(data);
          localStorage.setItem('group_name', data['0'].group.name)
        }
      })
    }
    else {
      this.getInfoAboutUser();
    }
  }

  getInfoAboutUser() {
    this.authService.getUserInfo().subscribe({
      next: (userData) => {
        this.userData = userData;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  //можно попробовать вынести в новый сервис
  hasRole(role: string) {
    return localStorage.getItem('role') === role;
  }
}
