import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { CartItem } from '../../../shared/models/cart.model';
import { SavedLaterActions } from '../saved-later/saved-later.actions';
import { CartActions } from './cart.actions';

export interface CartState {
  items: CartItem[];
  // The last list the server returned. A failed mutation rolls `items` back to it.
  confirmed: CartItem[];
  loaded: boolean;
}

const initialState: CartState = { items: [], confirmed: [], loaded: false };

export function discountPrice(item: CartItem): number {
  if (!item.discount) return item.price;
  return item.price - (item.price * item.discount) / 100;
}

const synced = (state: CartState, items: CartItem[]): CartState => ({
  ...state,
  items,
  confirmed: items,
});

export const cartFeature = createFeature({
  name: 'cart',
  reducer: createReducer(
    initialState,
    on(CartActions.loadSucceeded, (state, { items }) => ({ ...synced(state, items), loaded: true })),
    on(CartActions.loadFailed, (state): CartState => ({ ...state, loaded: true })),
    on(CartActions.reset, (): CartState => initialState),

    on(CartActions.addItem, (state, { item }): CartState => {
      const existing = state.items.some((i) => i.id === item.id);
      return {
        ...state,
        items: existing
          ? state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [item, ...state.items],
      };
    }),
    on(
      CartActions.removeItem,
      CartActions.saveForLater,
      (state, { id }): CartState => ({ ...state, items: state.items.filter((i) => i.id !== id) }),
    ),
    on(
      CartActions.updateQuantity,
      (state, { id, quantity }): CartState => ({
        ...state,
        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      }),
    ),
    on(CartActions.clear, (state): CartState => ({ ...state, items: [] })),

    on(
      CartActions.syncSucceeded,
      CartActions.saveForLaterSucceeded,
      (state, { items }) => synced(state, items),
    ),
    on(SavedLaterActions.moveToCartSucceeded, (state, { cart }) => synced(state, cart)),
    on(CartActions.syncFailed, (state): CartState => ({ ...state, items: state.confirmed })),
    on(CartActions.orderPlaced, (state) => synced(state, [])),
  ),
  extraSelectors: ({ selectItems }) => ({
    selectItemCount: createSelector(selectItems, (items) => items.length),
    selectTotalPrice: createSelector(selectItems, (items) =>
      items.reduce((acc, item) => acc + discountPrice(item) * item.quantity, 0),
    ),
  }),
});
