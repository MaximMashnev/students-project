import { GroupService } from './../../services/group-service';
import { Component, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-group-page',
  imports: [FormsModule],
  templateUrl: './group-page.html',
  styleUrl: './group-page.css',
})
export class GroupPage {
  allGroups: any;
  relationsGroups: any;
  selectedGroup: any;

  constructor (private router: Router, private titleService: Title, private groupService: GroupService) {
    this.setTitlePage();
    this.getGroups();
    this.getRelationsGroups();
  }

  setTitlePage() {
    if (sessionStorage.getItem("role") == "student") {
      this.titleService.setTitle('Моя группа');
    }
    else {
      this.titleService.setTitle('Группы');
    }
  }

  addGroup() {

  }

  getRelationsGroups () {
    this.groupService.getStudentsGroup().subscribe(data => {
      this.relationsGroups = data;
    });
  }

  getGroups() {
    this.allGroups = this.groupService.getAllGroups().subscribe();
  }
}
