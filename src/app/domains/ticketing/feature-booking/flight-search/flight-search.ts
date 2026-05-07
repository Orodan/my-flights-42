import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounce, form, FormField, minLength, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { Flight } from '../../data/flight';
import { FlightCard } from '../../ui/flight-card/flight-card';
import { FlightStore } from './flight-store';
import { filter } from 'rxjs';

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
  protected readonly filterForm = form(this.filter, (path) => {
    debounce(path, 300);

    required(path.from);
    minLength(path.from, 3);

    required(path.to);
    minLength(path.to, 3);
  });

  constructor() {
    toObservable(this.filter)
      .pipe(
        filter(() => this.filterForm().valid()),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.search());
  }

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
