import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideRouter } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portfolio-didi');
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    // ...autres providers
  ]
});
