import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { Flight } from '../../data/flight';
import { FlightCard } from '../../ui/flight-card/flight-card';
import { FlightStore } from './flight-store';

@Component({
  selector: 'app-flight-search',
  imports: [FormField, JsonPipe, RouterLink, FlightCard],
  templateUrl: './flight-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearch {
  private readonly store = inject(FlightStore);

  protected readonly filter = linkedSignal(() => ({
    from: this.store.from(),
    to: this.store.to(),
  }));
  protected readonly filterForm = form(this.filter);

  protected readonly flights = this.store.flights;
  protected readonly error = this.store.flightsError;
  protected readonly isLoading = this.store.flightsIsLoading;

  protected readonly selectedFlight = signal<Flight | null>(null);

  protected readonly basket = this.store.basket;

  protected search(): void {
    this.store.updateFilter(this.filter().from, this.filter().to);
  }

  protected select(flight: Flight): void {
    this.selectedFlight.set(flight);
  }

  protected updateBasket(flightId: number, selected: boolean): void {
    this.store.updateBasket(flightId, selected);
  }
}
