import { CartItem } from '../../../shared/models/cart.model';
import { SavedLaterActions } from '../saved-later/saved-later.actions';
import { savedLaterFeature } from '../saved-later/saved-later.reducer';
import { CartActions } from './cart.actions';
import { cartFeature } from './cart.reducer';

function item(id: string, quantity = 1): CartItem {
  return { id, name: id, price: 100, discount: 10, quantity } as CartItem;
}

const reduceCart = cartFeature.reducer;
const reduceSaved = savedLaterFeature.reducer;

describe('cart + savedLater reducers', () => {
  it('adds a new item, then bumps the quantity of an existing one', () => {
    let state = reduceCart(undefined, CartActions.addItem({ item: item('a') }));
    state = reduceCart(state, CartActions.addItem({ item: item('a') }));

    expect(state.items).toEqual([item('a', 2)]);
  });

  it('rolls back to the last server list when a mutation fails', () => {
    let state = reduceCart(undefined, CartActions.loadSucceeded({ items: [item('a')] }));
    state = reduceCart(state, CartActions.removeItem({ id: 'a' }));
    expect(state.items).toEqual([]);

    state = reduceCart(state, CartActions.syncFailed());
    expect(state.items).toEqual([item('a')]);
  });

  it('save-for-later reconciles both lists from the one response', () => {
    const cart = reduceCart(undefined, CartActions.loadSucceeded({ items: [item('a')] }));
    const done = CartActions.saveForLaterSucceeded({ items: [], savedLater: [item('a')] });

    expect(reduceCart(cart, done).items).toEqual([]);
    expect(reduceSaved(undefined, done).items).toEqual([item('a')]);
  });

  it('move-to-cart sets the cart from the response rather than incrementing', () => {
    const cart = reduceCart(undefined, CartActions.loadSucceeded({ items: [item('a', 3)] }));
    const done = SavedLaterActions.moveToCartSucceeded({ items: [], cart: [item('a', 3)] });

    expect(reduceCart(cart, done).items).toEqual([item('a', 3)]);
    expect(reduceSaved(undefined, done).items).toEqual([]);
  });

  it('computes the discounted total', () => {
    const items = [item('a', 2), item('b', 1)];
    expect(cartFeature.selectTotalPrice.projector(items)).toBe(270);
  });
});
