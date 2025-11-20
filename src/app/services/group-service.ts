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
    console.log('addNewGroup: ' + Group);
    return this.http.post<Group>(this.GroupUrl, Group).pipe();
  }

  deleteGroup(Group: Group): Observable<Group> {
    console.log("deleteGroup " + Group);
    return this.http.delete<Group>(this.GroupUrl +`/${Group.id}`);
  }

  editingGroup(oldDataGroup: Group, newDataGroup: Group): Observable<Group> {
    if (newDataGroup != null) {
      newDataGroup.id = oldDataGroup.id;
      console.log(`editingUser newData: ${newDataGroup.name}`);
      return this.http.patch<Group>(this.GroupUrl +`/${oldDataGroup.id}`, newDataGroup);
    } else {
      return this.http.patch<Group>(this.GroupUrl +`/${oldDataGroup.id}`, oldDataGroup);
    }
  }
}
