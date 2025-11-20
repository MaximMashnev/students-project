import { Routes } from '@angular/router';
import { Authorization } from './components/authorization/authorization';
import { TableStudents } from './components/table-students/table-students';
import { ProfileCard } from './components/profile-card/profile-card';
import { Registration } from './components/registration/registration';
import { MainPage } from './components/main-page/main-page';
import { GroupPage } from './components/group-page/group-page';

export const routes: Routes = [
  { path: 'main', component: MainPage,
    children: [
      { path: 'students', component: TableStudents },
      { path: 'profile', component: ProfileCard},
      { path: 'group', component: GroupPage}
    ]
  },
  { path: 'auth', component: Authorization },
  { path: 'registration', component: Registration},
  // { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];
