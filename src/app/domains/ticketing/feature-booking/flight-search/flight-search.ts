import { JsonPipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Flight } from '../../data/flight';
import { FlightCard } from '../../ui/flight-card/flight-card';

@Component({
  selector: 'app-flight-search',
  imports: [FormField, JsonPipe, FlightCard],
  templateUrl: './flight-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearch {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly filter = signal({
    from: 'Hamburg',
    to: 'Graz',
  });
  protected readonly filterForm = form(this.filter);

  protected readonly flightsResource = httpResource<Flight[]>(
    () => {
      if (!this.filter().from || !this.filter().to) {
        return undefined;
      }

      return {
        url: 'https://demo.angulararchitects.io/api/flight',
        params: {
          from: this.filter().from,
          to: this.filter().to,
        },
      };
    },
    { defaultValue: [] },
  );

  protected readonly flights = this.flightsResource.value;
  protected readonly error = this.flightsResource.error;
  protected readonly isLoading = this.flightsResource.isLoading;

  protected readonly selectedFlight = signal<Flight | null>(null);

  protected readonly basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });

  constructor() {
    effect(() => {
      if (this.error() || this.filter().to === 'error') {
        const message = 'Error loading flights: ' + this.error()?.message;

        this.snackBar.open(message, 'OK');
      }
    });
  }

  protected search(): void {
    this.flightsResource.reload();
  }

  protected select(flight: Flight): void {
    this.selectedFlight.set(flight);
  }

  protected updateBasket(flightId: number, selected: boolean): void {
    this.basket.update((basket) => ({
      ...basket,
      [flightId]: selected,
    }));
  }
}
