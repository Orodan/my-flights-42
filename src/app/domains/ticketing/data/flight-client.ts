import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';

import { Flight } from './flight';

@Injectable({
  providedIn: 'root',
})
export class FlightClient {
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
}
