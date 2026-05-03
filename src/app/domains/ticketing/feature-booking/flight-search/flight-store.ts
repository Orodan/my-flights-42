import { computed, inject, Injectable, signal } from '@angular/core';

import { FlightClient } from '../../data/flight-client';

@Injectable({
  providedIn: 'root',
})
export class FlightStore {
  private flightClient = inject(FlightClient);

  private readonly _from = signal('Graz');
  readonly from = this._from.asReadonly();

  private readonly _to = signal('Hamburg');
  readonly to = this._to.asReadonly();

  private readonly _basket = signal<Record<number, boolean>>({});
  readonly basket = this._basket.asReadonly();

  private readonly _delay = signal(0);
  readonly delayInMin = this._delay.asReadonly();

  private readonly flightResource = this.flightClient.findResource(this.from, this.to);

  readonly flights = this.flightResource.value;
  readonly flightsIsLoading = this.flightResource.isLoading;
  readonly flightsError = this.flightResource.error;
  readonly flightsIsLoaded = computed(() => this.flightResource.status() === 'resolved');

  updateFilter(from: string, to: string): void {
    this._from.set(from);
    this._to.set(to);
  }

  updateFrom(from: string): void {
    this._from.set(from);
  }

  updateTo(to: string): void {
    this._to.set(to);
  }

  updateBasket(flightId: number, selected: boolean): void {
    this._basket.update((basket) => ({
      ...basket,
      [flightId]: selected,
    }));
  }

  reload(): void {
    this.flightResource.reload();
  }
}
