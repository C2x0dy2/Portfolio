import path from 'path';
import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
export const routes = [
  { path: '', component: HomeComponent },
  {path: 'about', loadComponent: () => import('./about/about.component').then(m => m.AboutComponent) },
  {path: 'projects', loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent) },
  {path: 'contact', loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent) },
  // ... autres routes
];
