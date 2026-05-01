import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './shell/navbar/navbar';
import { Sidebar } from './shell/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('my-flights-42');

  protected updateTitle(): void {
    this.title.set('Highly sophisticated flight app');

    console.log('Title updated', this.title());
  }
}
