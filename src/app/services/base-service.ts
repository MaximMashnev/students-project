import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root'
})

export class BaseService {
  private UsersUrl = 'https://c68b6a416d126ef6.mokky.dev/users';

  constructor(
    private http: HttpClient,
  ) { }


  getDataTable(find: string, page: number, limit: number, sortdata: string): Observable<any> {
    console.log("find: " + find.length);
    page += 1;

    let url = this.UsersUrl;
    // const params = `?page=${page}&limit=${limit}&sortBy=${sortdata}`;

    // Поиск по номеру
    if ((/[0-9]/.test(find)) && find.includes("+")) {
      url += `?phoneNumber=${find}&page=${page}&limit=${limit}&sortBy=${sortdata}`;
    }
    // Поиск по группе
    else if (find.length >= 4 && find.includes("-")) {
      url += `?group=${find}&page=${page}&limit=${limit}&sortBy=${sortdata}`;
    }
    // Поиск по id
    else if (/[0-9]/.test(find)) {
      url += `?id=${find}&page=${page}&limit=${limit}&sortBy=${sortdata}`;
    }
    // TODO: переписать под name, surname и т.д. find[1]
    // Поиск по ФИО
    else if (find.split(' ').length >= 2) {
      url += `?fio=${find}&page=${page}&limit=${limit}&sortBy=${sortdata}`;
    }
    // Без поиска
    else {
      console.log(page);
      url += `?page=${page}&limit=${limit}&sortBy=${sortdata}`;
    }
    // Пользователи с группами
    // else {
    //   url += '?_relations=groups';
    // }

    return this.http.get<any[]>(url);
  }

  addNewUser(User: User): Observable<User> {
    console.log('addNewUser: ' + User);
    return this.http.post<User>(this.UsersUrl, User);
  }

  deleteUser(User: User): Observable<User> {
    console.log("deleteUser");
    return this.http.delete<User>(this.UsersUrl +`/${User.id}`);
  }

  editingUser(UserData: User, newUserData: User): Observable<User> {
    if (newUserData != null) {
      newUserData.id = UserData.id;
      console.log(`editingUser newData: ${newUserData} | ${newUserData}`);
      return this.http.patch<User>(this.UsersUrl +`/${UserData.id}`, newUserData);
    }
    else {
      return this.http.patch<User>(this.UsersUrl +`/${UserData.id}`, UserData);
    }
  }
}

