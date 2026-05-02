import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flight-edit',
  imports: [],
  templateUrl: './flight-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightEdit {
  private readonly router = inject(ActivatedRoute);

  protected readonly id = input.required({ transform: numberAttribute });
  protected readonly showDetails = input({ transform: booleanAttribute });

  constructor() {
    effect(() => {
      console.log('id ', this.id());
      console.log('showDetails ', this.showDetails());
    });
  }
}
