import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '',         component: HomeComponent,
    data: { page: 0 } },
  { path: 'about',    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent),
    data: { page: 1 } },
  { path: 'projects', loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent),
    data: { page: 2 } },
  { path: 'contact',  loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent),
    data: { page: 3 } },
];
