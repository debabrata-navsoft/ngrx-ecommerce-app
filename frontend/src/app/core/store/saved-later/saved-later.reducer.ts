import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { CartItem } from '../../../shared/models/cart.model';
import { CartActions } from '../cart/cart.actions';
import { SavedLaterActions } from './saved-later.actions';

export interface SavedLaterState {
  items: CartItem[];
  confirmed: CartItem[];
}

const initialState: SavedLaterState = { items: [], confirmed: [] };

const synced = (items: CartItem[]): SavedLaterState => ({ items, confirmed: items });

export const savedLaterFeature = createFeature({
  name: 'savedLater',
  reducer: createReducer(
    initialState,
    on(SavedLaterActions.reset, (): SavedLaterState => initialState),
    on(
      SavedLaterActions.moveToCart,
      SavedLaterActions.remove,
      (state, { id }): SavedLaterState => ({
        ...state,
        items: state.items.filter((i) => i.id !== id),
      }),
    ),
    on(
      SavedLaterActions.loadSucceeded,
      SavedLaterActions.syncSucceeded,
      SavedLaterActions.moveToCartSucceeded,
      (_state, { items }) => synced(items),
    ),
    on(CartActions.saveForLaterSucceeded, (_state, { savedLater }) => synced(savedLater)),
    on(SavedLaterActions.syncFailed, (state): SavedLaterState => ({ ...state, items: state.confirmed })),
  ),
  extraSelectors: ({ selectItems }) => ({
    selectItemCount: createSelector(selectItems, (items) => items.length),
  }),
});
