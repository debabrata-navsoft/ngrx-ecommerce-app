import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, mergeMap, of, switchMap } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { CartItem } from '../../../shared/models/cart.model';
import { SessionActions } from '../session/session.actions';
import { SavedLaterActions } from './saved-later.actions';

export const followSession$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(SessionActions.settled),
      map(({ user }) => (user ? SavedLaterActions.load() : SavedLaterActions.reset())),
    ),
  { functional: true },
);

export const load$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(SavedLaterActions.load),
      switchMap(() =>
        api.get<{ items: CartItem[] }>('/saved-later').pipe(
          map(({ items }) => SavedLaterActions.loadSucceeded({ items })),
          catchError(() => EMPTY),
        ),
      ),
    ),
  { functional: true },
);

export const add$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(SavedLaterActions.add),
      mergeMap(({ productId }) =>
        api.post<{ items: CartItem[] }>('/saved-later', { productId }).pipe(
          map(({ items }) => SavedLaterActions.syncSucceeded({ items })),
          catchError(() => of(SavedLaterActions.syncFailed())),
        ),
      ),
    ),
  { functional: true },
);

export const remove$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(SavedLaterActions.remove),
      mergeMap(({ id }) =>
        api.delete<{ items: CartItem[] }>(`/saved-later/${id}`).pipe(
          map(({ items }) => SavedLaterActions.syncSucceeded({ items })),
          catchError(() => of(SavedLaterActions.syncFailed())),
        ),
      ),
    ),
  { functional: true },
);

export const moveToCart$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(SavedLaterActions.moveToCart),
      mergeMap(({ id }) =>
        api.post<{ items: CartItem[]; cart: CartItem[] }>(`/saved-later/${id}/move-to-cart`).pipe(
          map((res) => SavedLaterActions.moveToCartSucceeded(res)),
          catchError(() => of(SavedLaterActions.syncFailed())),
        ),
      ),
    ),
  { functional: true },
);
