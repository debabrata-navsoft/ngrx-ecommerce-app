import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { CartItem } from '../../../shared/models/cart.model';

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    Load: emptyProps(),
    'Load Succeeded': props<{ items: CartItem[] }>(),
    'Load Failed': emptyProps(),
    Reset: emptyProps(),

    // Optimistic mutations: the reducer applies them at once, an effect sends the request.
    'Add Item': props<{ item: CartItem }>(),
    'Remove Item': props<{ id: string }>(),
    'Update Quantity': props<{ id: string; quantity: number }>(),
    Clear: emptyProps(),
    'Save For Later': props<{ id: string }>(),

    // Every mutation endpoint returns the full list; success reconciles against it and
    // failure falls back to the last list the server confirmed.
    'Sync Succeeded': props<{ items: CartItem[] }>(),
    'Save For Later Succeeded': props<{ items: CartItem[]; savedLater: CartItem[] }>(),
    'Sync Failed': emptyProps(),

    // Payment verified: the server already emptied the cart when the order was placed.
    'Order Placed': emptyProps(),
  },
});
