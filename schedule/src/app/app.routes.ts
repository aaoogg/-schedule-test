import { Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./welcome/welcome.component').then(m => m.WelcomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
      },
      {
        path: 'peoples',
        loadComponent: () => import('./peoples/peoples.component').then(m => m.PeoplesComponent),
      },
      {
        path: 'contacts',
        loadComponent: () => import('./contacts/contacts.component').then(m => m.ContactsComponent),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'home'
      },
    ]
  },
];
