import { User } from './../../models/user';
import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule, MatOption } from '@angular/material/select';

@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-edit.html',
  styleUrl: './dialog-edit.css',
  imports: [
    MatFormFieldModule, FormsModule, MatDialogModule,
    CommonModule, MatInputModule, MatIconModule,
    MatButtonModule, MatOption, MatSelectModule
  ]
})

export class DialogEdit {
  editingUser: User;
  user: any;
  userRole: any;
  dialogTitle = 'Добавить студента';
  dialogCloseButton = 'Добавить';
  validNameInput = false;
  validSurnameInput = false;
  validPatronymicInput = false;

  ROLES = [
    {
      "id" : 0,
      "role" : "admin",
      "name_ru" : "Администратор",
    },
    {
      "id" : 1,
      "role" : "teacher",
      "name_ru" : "Преподаватель",
    },
    {
      "id" : 2,
      "role" : "student",
      "name_ru" : "Студент",
    }
  ]

  constructor(
    public dialogRef: MatDialogRef<DialogEdit>,
    @Inject(MAT_DIALOG_DATA) public data: User) {
      this.editingUser = data ? {...data} : new User();
      this.user = data;
      this.userRole = data.role;
      if (data) {
        if (this.editingUser.group_id === undefined) {
          this.dialogTitle = `Редактирование профиля`;
          if (this.user.group.id === undefined) {
            this.user.group.id = localStorage.getItem("group_id")
          }
          this.editingUser.group_id = [this.user.group.id];
          this.user.group_id = this.editingUser.group_id;
          delete this.user.group;
          this.editingUser = this.user;
        }
        else {
          this.dialogTitle = `Редактирование пользователя с ID ${this.editingUser.id}`;
        }
        this.dialogCloseButton = 'Сохранить';
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  validateFormName(formValueName: string): boolean {
    this.validNameInput = /^[a-zA-Zа-яА-Я]+$/.test(formValueName) ? true : false;
    return this.validNameInput;
  }

  validateFormSurname(formValueSurname: string): boolean {
    this.validSurnameInput = /^[a-zA-Zа-яА-Я]+$/.test(formValueSurname) ? true : false;
    return this.validSurnameInput;
  }

  validateFormPatronymic(formValuePatronymic: string): boolean {
    this.validPatronymicInput = /^[a-zA-Zа-яА-Я]+$/.test(formValuePatronymic) ? true : false;
    return this.validPatronymicInput;
  }

  checkValidateConfirm(): boolean {
    return (this.validNameInput && this.validSurnameInput && this.validPatronymicInput) ? false : true;
  };
}
