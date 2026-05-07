import { inject, Injectable, signal } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { FlightClient } from '../../data/flight-client';
import { Flight } from '../../data/flight';

@Injectable({
  providedIn: 'root',
})
export class FlightDetailStore {
  private readonly flightClient = inject(FlightClient);

  private readonly _flightId = signal(0);
  readonly flightId = this._flightId.asReadonly();

  private readonly _isPending = signal(false);
  readonly isPending = this._isPending.asReadonly();

  private readonly flightResource = this.flightClient.findResourceById(this.flightId);

  readonly flight = this.flightResource.value;
  readonly error = this.flightResource.error;
  readonly isLoading = this.flightResource.isLoading;

  setFlightId(id: number): void {
    this._flightId.set(id);
  }

  saveFlight(flight: Flight): Promise<Flight> {
    return firstValueFrom(this.flightClient.update(flight));
  }
}
