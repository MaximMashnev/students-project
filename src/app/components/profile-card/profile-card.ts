import { User } from './../../models/user';
import { Component} from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
  selector: 'app-profile-card',
  imports: [MatCardModule, MatFormFieldModule],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.css',
})
export class ProfileCard {
  userData!: any;

  constructor(private router: Router, private titleService: Title, private AuthService: AuthService) {
    this.titleService.setTitle('Профиль');
    if (sessionStorage.getItem("username")) {
      this.userData = new User();
      for (let key in sessionStorage) {
        if (sessionStorage.getItem(key) != null) {
          this.userData[key] = sessionStorage.getItem(key);
        }
      }
    }
    else {
      this.getInfoAboutUser();
    }
  }

  getInfoAboutUser() {
    this.AuthService.getUserInfo().subscribe({
      next: (userData) => {
        this.userData = userData;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  hideBtn() {
    if (this.userData.role = "student") {
      return true;
    }
    else {
      return false;
    }
  }
}
