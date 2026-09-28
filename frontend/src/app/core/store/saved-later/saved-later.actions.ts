import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { CartItem } from '../../../shared/models/cart.model';

export const SavedLaterActions = createActionGroup({
  source: 'Saved Later',
  events: {
    Load: emptyProps(),
    'Load Succeeded': props<{ items: CartItem[] }>(),
    Reset: emptyProps(),

    Add: props<{ productId: string }>(),
    Remove: props<{ id: string }>(),
    // One atomic request. It creates the cart row itself, so it must never be paired with
    // CartActions.addItem — that incremented the quantity on every round trip.
    'Move To Cart': props<{ id: string }>(),

    'Sync Succeeded': props<{ items: CartItem[] }>(),
    'Move To Cart Succeeded': props<{ items: CartItem[]; cart: CartItem[] }>(),
    'Sync Failed': emptyProps(),
  },
});
