import { User } from './../../models/user';
import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from '@angular/material/dialog';
import { DialogEdit } from '../dialog-edit-user/dialog-edit';
import { BaseService } from '../../services/base-service';

@Component({
  selector: 'app-profile-card',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.css',
})
export class ProfileCard {
  userData!: any;

  constructor(
    private titleService: Title,
    private authService: AuthService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private baseService: BaseService,
  ) {
    this.titleService.setTitle('Профиль');
    this.getLocalStorage();
  }

  setLocalStorage() {
    for (let key in localStorage) {
      if (localStorage.getItem(key) != null) {
        localStorage.setItem(key, this.userData[key]);
      }
    }
  }

  getLocalStorage() {
    if (localStorage.getItem("username")) {
      this.userData = new User();
      for (let key in localStorage) {
        if (localStorage.getItem(key) != null) {
          this.userData[key] = localStorage.getItem(key);
        }
      }
      this.authService.getMyInfo().subscribe({
        next: (data) => {
          this.userData = data['0'];
          localStorage.setItem('group_name', data['0'].group.name)
        }
      })
    }
  }

  // передает неверные данные, данные всегда от пользователя id = 1
  getInfoAboutUser() {
    this.authService.getUserInfo().subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  openDialogEditUser() {
    const dialogAddingNewUser = this.dialog.open(DialogEdit, {
      width: '400px',
      data: this.userData
    });
    dialogAddingNewUser.afterClosed().subscribe((result: User) => {
      if(result != null) {
        this.baseService.editingUser(this.userData, result).subscribe(() => {
          this.userData = result;
          result.group_id = this.userData.group;
          this.setLocalStorage();
          this.cdr.detectChanges();
        });
      }
    });
  }

  //можно попробовать вынести в новый сервис
  hasRole(role: string) {
    return localStorage.getItem('role') === role;
  }
}
