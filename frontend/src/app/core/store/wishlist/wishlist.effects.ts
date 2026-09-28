import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, mergeMap, Observable, of, switchMap } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { Product } from '../../../shared/models/product.model';
import { SessionActions } from '../session/session.actions';
import { WishlistActions } from './wishlist.actions';

function sync(request: Observable<{ items: Product[] }>) {
  return request.pipe(
    map(({ items }) => WishlistActions.syncSucceeded({ items })),
    catchError(() => of(WishlistActions.syncFailed())),
  );
}

export const followSession$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(SessionActions.settled),
      map(({ user }) => (user ? WishlistActions.load() : WishlistActions.reset())),
    ),
  { functional: true },
);

export const load$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(WishlistActions.load),
      switchMap(() =>
        api.get<{ items: Product[] }>('/wishlist').pipe(
          map(({ items }) => WishlistActions.loadSucceeded({ items })),
          catchError(() => EMPTY),
        ),
      ),
    ),
  { functional: true },
);

export const add$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(WishlistActions.add),
      mergeMap(({ product }) => sync(api.post('/wishlist', { productId: product.id }))),
    ),
  { functional: true },
);

export const remove$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(WishlistActions.remove),
      mergeMap(({ id }) => sync(api.delete(`/wishlist/${id}`))),
    ),
  { functional: true },
);
