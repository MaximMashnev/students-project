import { GroupService } from './../../services/group-service';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy } from "@angular/core";
import { NgxScrollTopComponent } from "ngx-scrolltop";
import { Title } from '@angular/platform-browser';
import { User } from '../../models/user';
import { DialogEdit } from '../dialog-edit-user/dialog-edit';
import { BaseService } from '../../services/base-service';
import { MatOption, MatSelectModule } from "@angular/material/select";
import { FormsModule} from "@angular/forms";

@Component({
  selector: 'app-table-students',
  templateUrl: './table-students.html',
  styleUrl: './table-students.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule, MatInputModule, MatTableModule,
    MatSortModule, MatPaginatorModule, MatButtonModule,
    MatIconModule, NgxScrollTopComponent, MatSelectModule,
    MatOption, FormsModule,
],
})
export class TableStudents implements AfterViewInit {
  displayedColumns: string[] = ['id', 'surname', 'name',  'patronymic', 'group', 'phoneNumber', 'role', 'control'];
  dataSource = new MatTableDataSource<User>([]);
  page = 0;
  limit = 5;
  totalItems!: number;
  filterValue: string = "";
  defSort: Sort = { active: 'id', direction: 'asc' };
  timeout: any;
  selectedGroup: any;
  groups: any;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private baseService: BaseService,
    public dialog: MatDialog,
    private titleService: Title,
    private groupService: GroupService,
    private cdr: ChangeDetectorRef
  ) {
      this.titleService.setTitle("Таблица студентов");
      this.loadData();
      this.getGroupInfo();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    setTimeout(() => this.paginator!.length = this.totalItems);
  }

  getGroupInfo() {
    this.groupService.getStudentsGroup().subscribe(data => {
      this.groups = data;
    });
  }

  loadData(page: number = this.page, limit: number = this.limit) {
    const sortField = this.getSortField();
    const filter = this.filterValue?.trim() || '';

    this.baseService.getDataTable(filter, page, limit, sortField, this.selectedGroup).subscribe(data => {
      console.log(data);
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

  update(event: PageEvent) {
    const isSizeChanged = this.limit != event.pageSize;

    this.limit = event.pageSize;
    const newPage = isSizeChanged ? 0 : event.pageIndex;
    if (isSizeChanged) this.paginator?.firstPage();

    this.loadData(newPage, this.limit);
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
          this.baseService.addNewUser(result).subscribe(() => this.loadData(this.page, this.limit));
        }
        else {
          this.baseService.editingUser(UserData, result).subscribe(() => this.loadData(this.page, this.limit));
        }
      }
    });
  }

  addNewUser() {
    console.log("addNewUser");
    this.openDialogEditAndAdd(null);
  }

  delUser(User: User) {
    console.log("del User: " + User);
    this.baseService.deleteUser(User).subscribe(() => this.loadData(this.page, this.limit));
  }

  editUser(User: User) {
    console.log("edit User: " + User);
    this.openDialogEditAndAdd(User);
  }
}
