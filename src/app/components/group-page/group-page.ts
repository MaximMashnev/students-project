import { GroupService } from './../../services/group-service';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { Group } from '../../models/group';
import { MatFormField } from "@angular/material/form-field";
import { MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../models/user';
import { MatIconModule } from "@angular/material/icon";
import { DialogEdit } from '../dialog-edit-user/dialog-edit';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-group-page',
  imports: [
    FormsModule, MatFormField, MatFormFieldModule,
    MatSelectModule, MatInputModule,
    MatIconModule, MatTableModule],
  templateUrl: './group-page.html',
  styleUrl: './group-page.css',
})
export class GroupPage implements OnInit {
  displayedColumns: string[] = ['id', 'surname', 'name',  'patronymic', 'group', 'phoneNumber', 'control'];
  dataSource = new MatTableDataSource<User>([]);

  group: Group;
  allGroups: any;
  relationsGroups: any;
  selectedGroup!: Group;
  nameGroup!: string;
  selectedGroupId: number = 0;
  saveEditBtn: string = "Создать";
  btnDisabled: boolean = true;
  baseService: any;
  role = localStorage.getItem("role");

  constructor (
    private titleService: Title,
    private groupService: GroupService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.group = new Group();
  }

  ngOnInit() {
    this.setTitlePage();
    this.getRelationsGroups();
    this.loadData();
    if (this.role == "student") {
      this.displayedColumns = ['id', 'surname', 'name',  'patronymic', 'group', 'phoneNumber'];
    }
  }

  getNameGroup(): string {
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
    if (localStorage.getItem("role") == "student") {
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

  loadData() {
    this.groupService.getMyGroup(<number> <unknown> localStorage.getItem("group_id")).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      console.log(this.dataSource);
      this.cdr.detectChanges();
    });
  }

  openDialogEditAndAdd(UserData: User | any) {
    const dialogAddingNewUser = this.dialog.open(DialogEdit, {
      width: '400px',
      data: UserData
    });
    dialogAddingNewUser.afterClosed().subscribe((result: User) => {
      if(result != null) {
        if(result.id == null) {
          this.baseService.addNewUser(result).subscribe(() => this.loadData());
        }
        else {
          this.baseService.editingUser(UserData, result).subscribe(() => this.loadData());
        }
      }
    });
  }

  hideBtn() {
    if (localStorage.getItem("role") == "student") {
      return false;
    }
    else {
      return true;
    }
  }

  addNewUser() {
    console.log("addNewUser");
    this.openDialogEditAndAdd(null);
  }

  delUser(User: User) {
    console.log("del User: " + User);
    this.baseService.deleteUser(User).subscribe(() => this.loadData());
  }

  editUser(User: User) {
    console.log("edit User: " + User);
    this.openDialogEditAndAdd(User);
  }
}
