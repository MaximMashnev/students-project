import { GroupService } from './../../services/group-service';
import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
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
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { NgxScrollTopComponent } from "ngx-scrolltop";
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BaseService } from '../../services/base-service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-group-page',
  imports: [
    FormsModule, MatFormField, MatFormFieldModule,
    MatSelectModule, MatInputModule, MatIconModule,
    MatTableModule, MatSortModule, MatPaginatorModule,
    NgxScrollTopComponent, MatButtonModule,
],
  templateUrl: './group-page.html',
  styleUrl: './group-page.css',
})
export class GroupPage implements OnInit {
  displayedColumns: string[] = ['id', 'surname', 'name',  'patronymic', 'group', 'phoneNumber', 'control'];
  dataSource = new MatTableDataSource<User>([]);
  page = 0;
  limit = 5;
  totalItems!: number;
  filterValue: string = "";
  defSort: Sort = { active: 'id', direction: 'asc' };
  timeout: any;
  selectedGroupInFilter: any;
  groups: any;

  group: Group;
  allGroups: any;
  relationsGroups: any;
  selectedGroup!: Group;
  nameGroup!: string;
  selectedGroupId: number = 0;
  saveEditBtn: string = "Создать";
  btnDisabled: boolean = true;
  role = localStorage.getItem("role");

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor (
    private titleService: Title,
    private groupService: GroupService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private baseService: BaseService,
  ) {
    this.group = new Group();
    this.loadData();
    this.getGroupInfo();
  }

  ngOnInit() {
    this.setTitlePage();
    this.getRelationsGroups();
    this.loadData();
    if (this.role == "student") {
      this.displayedColumns = ['id', 'surname', 'name',  'patronymic', 'phoneNumber'];
    }
    else if (this.role == "teacher") {
      this.displayedColumns = ['id', 'surname', 'name',  'patronymic', 'group', 'phoneNumber'];
    }
    else {
      this.displayedColumns = ['id', 'surname', 'name',  'patronymic', 'group', 'phoneNumber', 'control'];
    }
  }

  editNameGroup(): string {
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

  update(event: PageEvent) {
    const isSizeChanged = this.limit != event.pageSize;

    this.limit = event.pageSize;
    const newPage = isSizeChanged ? 0 : event.pageIndex;
    if (isSizeChanged) this.paginator?.firstPage();

    this.loadData(newPage, this.limit);
  }

  getGroupInfo() {
    this.groupService.getStudentsGroup().subscribe(data => {
      this.groups = data;
    })
  }

  loadData(page: number = this.page, limit: number = this.limit) {
    const sortField = this.getSortField();
    const filter = this.filterValue?.trim() || '';
    if (this.role == "student" || this.role == "teacher" ) {
      this.selectedGroupInFilter = Number(localStorage.getItem('group_id'));
    }

    this.baseService.getDataTable(filter, page, limit, sortField, this.selectedGroupInFilter).subscribe(data => {
      this.dataSource = new MatTableDataSource(data.items);
      this.totalItems = data.meta.total_items;
      this.limit = data.meta.per_page;
      this.cdr.detectChanges();
    });
  }

  getSortField(): string {
    if (!this.defSort.direction) return 'id';
    return this.defSort.direction == 'asc' ? this.defSort.active : '-' + this.defSort.active;
  }

  sortData(sort: Sort) {
    this.defSort = sort;
    this.loadData();
    this.paginator?.firstPage();
  }

  applyFilter() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getGroupInfo();
      this.loadData();
      this.paginator?.firstPage();
    }, 1000);
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
    })
  }

  addNewUser() {
    this.openDialogEditAndAdd(null);
  }

  delUser(User: User) {
    this.baseService.deleteUser(User).subscribe(() => this.loadData());
  }

  editUser(User: User) {
    this.openDialogEditAndAdd(User);
  }
}
