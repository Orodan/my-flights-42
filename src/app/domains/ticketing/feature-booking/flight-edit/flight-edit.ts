import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FlightDetailStore } from './flight-detail-store';
import { form, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-flight-edit',
  imports: [],
  templateUrl: './flight-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightEdit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(FlightDetailStore);

  protected readonly showDetails = input({ transform: booleanAttribute });

  protected readonly flight = linkedSignal(() => this.store.flight());

  protected readonly flightForm = form(this.flight, (path) => {
    required(path.from);
    minLength(path.from, 3);

    required(path.to);
    minLength(path.to, 3);

    required(path.date);
  });

  constructor() {
    this.route.paramMap.subscribe((paramMap) => {
      const flightId = parseInt(paramMap.get('id') ?? '0');

      this.store.setFlightId(flightId);
    });

    effect(() => {
      console.log('flight: ', this.flight());
    });
  }
}
