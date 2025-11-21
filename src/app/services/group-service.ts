import { Group } from './../models/group';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {

  private GroupUrl = 'https://c68b6a416d126ef6.mokky.dev/groups'

  constructor(private http: HttpClient) { }

  getStudentsGroup(): Observable<Group> {
    return this.http.get<Group>(this.GroupUrl + "?_relations=user");
  }

  getAllGroups(): Observable<any>{
    return this.http.get<any[]>(this.GroupUrl).pipe();
  }

  addNewGroup(Group: Group): Observable<Group> {
    console.log('addNewGroup: ' + Group.name);
    return this.http.post<Group>(this.GroupUrl, Group).pipe();
  }

  deleteGroup(id: number): Observable<any> {
    console.log("deleteGroup " + id);
    return this.http.delete<Group>(this.GroupUrl +`/${id}`);
  }

  editingGroup(oldDataGroup: Group, newDataGroup: Group): Observable<Group> {
    console.log(oldDataGroup);
    if (newDataGroup != null) {
      newDataGroup['id'] = oldDataGroup.id;
      newDataGroup['user_id'] = oldDataGroup.user_id
      console.log(`editingUser newData: ${newDataGroup}`);
      return this.http.patch<Group>(this.GroupUrl +`/${oldDataGroup.id}`, newDataGroup);
    } else {
      return this.http.patch<Group>(this.GroupUrl +`/${oldDataGroup.id}`, oldDataGroup.name);
    }
  }
}
