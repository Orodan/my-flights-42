import { Component, signal } from '@angular/core';

import { Navbar } from './shell/navbar/navbar';
import { Sidebar } from './shell/sidebar/sidebar';
import { FlightSearch } from './domains/ticketing/feature-booking/flight-search/flight-search';

@Component({
  selector: 'app-root',
  imports: [Navbar, Sidebar, FlightSearch],
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
