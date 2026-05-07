import { JsonPipe } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { FieldTree, form, FormField, FormRoot } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FlightDetailStore } from './flight-detail-store';

import { flightSchema } from '../../data/flight-schema';
import { Flight } from '../../data/flight';
import { extractError } from '../../../shared/util-common/extract-error';

@Component({
  selector: 'app-flight-edit',
  imports: [FormField, JsonPipe, FormRoot],
  templateUrl: './flight-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightEdit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(FlightDetailStore);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly showDetails = input({ transform: booleanAttribute });

  protected readonly flight = linkedSignal(() => this.store.flight());

  protected readonly flightForm = form(this.flight, flightSchema, {
    submission: {
      action: async (form) => this.save(form),
      onInvalid: (form) => this.reportValidationError(form),
    },
  });

  constructor() {
    this.route.paramMap.subscribe((paramMap) => {
      const flightId = parseInt(paramMap.get('id') ?? '0');

      this.store.setFlightId(flightId);
    });
  }

  protected async save(form: FieldTree<Flight>) {
    try {
      await this.store.saveFlight(form().value());

      return null;
    } catch (error) {
      return {
        kind: 'processing_error',
        error: extractError(error),
      };
    }
  }

  private reportValidationError(form: FieldTree<Flight>): void {
    this.snackBar.open('Please correct the validation errors', 'OK');
    this.focusInvalid(form);
  }

  private focusInvalid(form: FieldTree<Flight>): void {
    const errors = form().errorSummary();

    if (errors.length > 0) {
      errors[0].fieldTree().focusBoundControl();
    }
  }
}
