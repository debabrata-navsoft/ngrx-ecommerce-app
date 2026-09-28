import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { Product } from '../../../shared/models/product.model';
import { WishlistActions } from './wishlist.actions';

export interface WishlistState {
  items: Product[];
  confirmed: Product[];
}

const initialState: WishlistState = { items: [], confirmed: [] };

export const wishlistFeature = createFeature({
  name: 'wishlist',
  reducer: createReducer(
    initialState,
    on(WishlistActions.reset, (): WishlistState => initialState),
    on(
      WishlistActions.add,
      (state, { product }): WishlistState => ({ ...state, items: [product, ...state.items] }),
    ),
    on(
      WishlistActions.remove,
      (state, { id }): WishlistState => ({ ...state, items: state.items.filter((p) => p.id !== id) }),
    ),
    on(
      WishlistActions.loadSucceeded,
      WishlistActions.syncSucceeded,
      (_state, { items }): WishlistState => ({ items, confirmed: items }),
    ),
    on(WishlistActions.syncFailed, (state): WishlistState => ({ ...state, items: state.confirmed })),
  ),
  extraSelectors: ({ selectItems }) => ({
    selectItemCount: createSelector(selectItems, (items) => items.length),
  }),
});
