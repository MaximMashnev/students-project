import { GroupService } from './../../services/group-service';
import { Component, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { Group } from '../../models/group';
import { MatFormField } from "@angular/material/form-field";
import { MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-group-page',
  imports: [FormsModule, MatFormField, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './group-page.html',
  styleUrl: './group-page.css',
})
export class GroupPage {
  group: Group;
  allGroups: any;
  relationsGroups: any;
  selectedGroup!: Group;
  nameGroup!: string;
  selectedGroupId: number = 0;
  saveEditBtn: string = "Создать";
  btnDisabled: boolean = true;

  constructor (private router: Router, private titleService: Title, private groupService: GroupService) {
    this.group = new Group();
    this.setTitlePage();
    // this.getGroups();
    this.getRelationsGroups();
  }

  getNameGroup(): string {
    console.log(this.selectedGroupId);
    if (this.selectedGroupId != 0) {
      this.saveEditBtn = "Сохранить";
      this.btnDisabled = false;
      return this.relationsGroups[this.selectedGroupId-1].name;
    }
    else {
      this.saveEditBtn = "Создать";
      this.btnDisabled = true;
      return "";
    }
  }

  setTitlePage() {
    if (sessionStorage.getItem("role") == "student") {
      this.titleService.setTitle('Моя группа');
    }
    else {
      this.titleService.setTitle('Группы');
    }
  }

  getRelationsGroups () {
    this.groupService.getStudentsGroup().subscribe(data => {
      this.relationsGroups = data;
    });
  }

  getGroups() {
    this.allGroups = this.groupService.getAllGroups().subscribe();
  }

  saveOrEditGroup() {
    this.group["name"] = this.nameGroup;
    if (this.selectedGroupId == 0) {
      this.groupService.addNewGroup(this.group).subscribe(
        () => this.getRelationsGroups()
      )
    }
    else {
      this.groupService.editingGroup(this.relationsGroups[this.selectedGroupId-1], this.group).subscribe(
        () => this.getRelationsGroups()
      )
    }
  }

  deleteGroup() {
    this.groupService.deleteGroup(this.selectedGroupId).subscribe(
      () => this.getRelationsGroups()
    )
  }
}
