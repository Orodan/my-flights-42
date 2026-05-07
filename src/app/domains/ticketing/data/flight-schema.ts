import { minLength, required, schema } from '@angular/forms/signals';

import { Flight } from './flight';

export const flightSchema = schema<Flight>((path) => {
  required(path.from);
  minLength(path.from, 3);

  required(path.to);
  minLength(path.to, 3);

  required(path.date);
});
