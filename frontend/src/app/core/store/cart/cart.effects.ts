import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, Observable, of, switchMap } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { CartItem } from '../../../shared/models/cart.model';
import { SessionActions } from '../session/session.actions';
import { CartActions } from './cart.actions';

function sync(request: Observable<{ items: CartItem[] }>) {
  return request.pipe(
    map(({ items }) => CartActions.syncSucceeded({ items })),
    catchError(() => of(CartActions.syncFailed())),
  );
}

export const followSession$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(SessionActions.settled),
      map(({ user }) => (user ? CartActions.load() : CartActions.reset())),
    ),
  { functional: true },
);

export const load$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(CartActions.load),
      switchMap(() =>
        api.get<{ items: CartItem[] }>('/cart').pipe(
          map(({ items }) => CartActions.loadSucceeded({ items })),
          catchError(() => of(CartActions.loadFailed())),
        ),
      ),
    ),
  { functional: true },
);

export const addItem$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(CartActions.addItem),
      mergeMap(({ item }) => sync(api.post('/cart', { productId: item.id }))),
    ),
  { functional: true },
);

export const removeItem$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(CartActions.removeItem),
      mergeMap(({ id }) => sync(api.delete(`/cart/${id}`))),
    ),
  { functional: true },
);

export const updateQuantity$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(CartActions.updateQuantity),
      mergeMap(({ id, quantity }) => sync(api.patch(`/cart/${id}`, { quantity }))),
    ),
  { functional: true },
);

export const clear$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(CartActions.clear),
      mergeMap(() => sync(api.delete('/cart'))),
    ),
  { functional: true },
);

// A single atomic move. Do not follow it with removeItem — see CLAUDE.md "list moves".
export const saveForLater$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(CartActions.saveForLater),
      mergeMap(({ id }) =>
        api
          .post<{ items: CartItem[]; savedLater: CartItem[] }>(`/cart/${id}/save-for-later`)
          .pipe(
            map((res) => CartActions.saveForLaterSucceeded(res)),
            catchError(() => of(CartActions.syncFailed())),
          ),
      ),
    ),
  { functional: true },
);
