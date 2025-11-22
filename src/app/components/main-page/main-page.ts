import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-main-page',
  imports: [RouterOutlet, MatIconModule, MatButtonModule],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {
  name = localStorage.getItem("name");
  surname = localStorage.getItem("surname");
  patronymic = localStorage.getItem("patronymic");
  role = localStorage.getItem("role");

  constructor(private router: Router, private titleService: Title) {
    this.titleService.setTitle("Главная страница")
  }

  goToProfilePage() {
    this.router.navigate(["main/profile"]);
  }

  goToStudentPage() {
    this.router.navigate(["main/students"]);
  }

  goToGroupPage() {
    this.router.navigate(["main/group"]);
  }

  logoutUser() {
    localStorage.removeItem("Bearer");
    localStorage.clear();
    this.router.navigate(["/auth"])
  }
}
