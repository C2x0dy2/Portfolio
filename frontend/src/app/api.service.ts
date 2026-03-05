import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  id: number;
  name: string;
  year: string;
  description: string;
  technologies: string[];
  features: string[];
  type: 'web' | 'mobile' | 'fullstack';
  deployed: boolean;
  github_link?: string;
  demo_link?: string;
  category: string;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
  category: 'languages' | 'frameworks';
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const API = 'http://127.0.0.1:8000/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${API}/projects/`);
  }

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${API}/skills/`);
  }

  sendContact(payload: ContactPayload): Observable<unknown> {
    return this.http.post(`${API}/contact/`, payload);
  }
}
