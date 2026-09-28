import { inject } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { User } from '../../../shared/models/user.model';
import { SessionActions } from './session.actions';

// Runs on the server too: ApiService forwards the visitor's cookie, and the transfer cache
// hands the same answer to the browser, so both renders resolve the same session.
export const init$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => SessionActions.refresh()),
    ),
  { functional: true },
);

export const refresh$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(SessionActions.refresh),
      switchMap(() =>
        api.get<{ user: User | null }>('/auth/me').pipe(
          map((res) => SessionActions.settled({ user: res.user })),
          catchError(() => of(SessionActions.settled({ user: null }))),
        ),
      ),
    ),
  { functional: true },
);
