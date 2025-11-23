import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://c68b6a416d126ef6.mokky.dev/';

  constructor(
    private http: HttpClient) { }

  getToken(username: string , password: string): Observable<any> {
    return this.http.post(
      this.baseUrl + 'auth',
      {
          "username": username,
          "password": password
      });
  }

  registerUser(username: string, password: string, name: string, surname: string, patronymic: string, phoneNumber: string): Observable<any> {
    return this.http.post(
      this.baseUrl + 'register',
      {
          "username": username,
          "password": password,
          "role": "student",
          "name": name,
          "surname": surname,
          "patronymic": patronymic,
          "phoneNumber": phoneNumber,
          "group_id": [],
      });
  }

  getUserInfo(): Observable<any> {
    return this.http.get(
      this.baseUrl + "auth_me"
    )
    // const userInfo = this.http.get(
    //   this.baseUrl + "auth_me"
    // )

    // console.log(userInfo);

    // return this.http.get(
    //   this.baseUrl + '_relations=groups&id=' + userInfo
    // )
  }

  getMyInfo(): Observable<any> {
    return this.http.get(
      this.baseUrl + 'users?_relations=groups&id=' + localStorage.getItem("id")
    )
  }

}
