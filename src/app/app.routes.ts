import path from 'path';
import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
export const routes = [
  { path: '', component: HomeComponent },
  {path: 'about', loadComponent: () => import('./about/about.component').then(m => m.AboutComponent) },

  // ... autres routes
];
