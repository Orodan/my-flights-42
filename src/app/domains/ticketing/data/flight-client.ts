import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';

import { Observable } from 'rxjs';

import { Flight, initialFlight } from './flight';

@Injectable({
  providedIn: 'root',
})
export class FlightClient {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://demo.angulararchitects.io/api';

  findResource(from: Signal<string>, to: Signal<string>): HttpResourceRef<Flight[]> {
    return httpResource<Flight[]>(
      () => {
        if (!from() || !to()) {
          return undefined;
        }

        return {
          url: `${this.baseUrl}/flight`,
          headers: {
            Accept: 'application/json',
          },
          params: {
            from: from(),
            to: to(),
          },
        };
      },
      { defaultValue: [] },
    );
  }

  findResourceById(id: Signal<number>): HttpResourceRef<Flight> {
    return httpResource<Flight>(
      () => ({
        url: `${this.baseUrl}/flight`,
        headers: {
          Accept: 'application/json',
        },
        params: {
          id: id(),
        },
      }),
      {
        defaultValue: initialFlight,
      },
    );
  }

  update(flight: Flight): Observable<Flight> {
    const url = `${this.baseUrl}/flight/${flight.id}`;
    const headers = {
      Accept: 'application/json',
    };

    return this.http.put<Flight>(url, flight, { headers });
  }
}
