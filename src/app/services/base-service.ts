import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class BaseService {
  private UsersUrl = 'https://c68b6a416d126ef6.mokky.dev/users';

  constructor(
    private http: HttpClient,
  ) { }


  getDataTable(find: string, page: number, limit: number, sortdata: string, secectedGroup: string): Observable<any> {
    page += 1;

    let url = this.UsersUrl + "?";

    if (secectedGroup != undefined && secectedGroup != '0') {
      url += `group_id=${secectedGroup}&`
    }
    // Поиск по номеру
    if ((/[0-9]/.test(find)) && find.includes("+")) {
      url += `phoneNumber=${find}&page=${page}&limit=${limit}&sortBy=${sortdata}`;
    }
    // Поиск по id
    else if (/[0-9]/.test(find)) {
      url += `id=${find}&page=${page}&limit=${limit}&sortBy=${sortdata}`;
    }
    // Поиск по фио
    else if (find.split(' ').length == 3) {
      url += `surname=${find.split(' ')[0]}&name=${find.split(' ')[1]}&patronymic=${find.split(' ')[2]}&page=${page}&limit=${limit}&sortBy=${sortdata}`;
    }
    // Поиск по имени и фамилии
    else if (find.split(' ').length == 2) {
      url += `surname=${find.split(' ')[0]}&name=${find.split(' ')[1]}&page=${page}&limit=${limit}&sortBy=${sortdata}`;
    }
    // Поиск по фамилии
    else if (find != '') {
      url += `surname=${find}&page=${page}&limit=${limit}&sortBy=${sortdata}`;
    }
    // Без поиска
    else {
      url += `page=${page}&limit=${limit}&sortBy=${sortdata}`;
    }

    return this.http.get<any[]>(url);
  }

  addNewUser(User: User): Observable<User> {
    return this.http.post<User>(this.UsersUrl, User);
  }

  deleteUser(User: User): Observable<User> {
    return this.http.delete<User>(this.UsersUrl +`/${User.id}`);
  }

  editingUser(userData: User, newUserData: User): Observable<User> {
    if (newUserData != null) {
      newUserData.id = userData.id;
      return this.http.patch<User>(this.UsersUrl +`/${userData.id}`, newUserData);
    }
    else {
      return this.http.patch<User>(this.UsersUrl +`/${userData.id}`, userData);
    }
  }
}

