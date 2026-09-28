import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { SessionService } from './session.service';
import { CartItem } from '../../shared/models/cart.model';
import { Product } from '../../shared/models/product.model';
import { CartActions } from '../store/cart/cart.actions';
import { cartFeature, discountPrice } from '../store/cart/cart.reducer';

/**
 * Facade over the `cart` store slice. Loading follows the session (see cart.effects.ts);
 * mutations dispatch an optimistic action and an effect sends the request, so nothing here
 * needs to be subscribed to.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private store = inject(Store);
  private session = inject(SessionService);

  cartLoaded = this.store.selectSignal(cartFeature.selectLoaded);
  cart = this.store.selectSignal(cartFeature.selectItems);
  itemCount = this.store.selectSignal(cartFeature.selectItemCount);
  totalPrice = this.store.selectSignal(cartFeature.selectTotalPrice);

  loadCart(): void {
    this.store.dispatch(CartActions.load());
  }

  getDiscountPrice(item: CartItem): number {
    return discountPrice(item);
  }

  addToCart(product: Product): void {
    if (!this.session.uid) return;

    // Only used if the product is not in the cart yet; otherwise the reducer bumps quantity.
    const item = {
      id: product.id,
      name: product.title,
      price: product.price,
      discount: product.discount || 0,
      image: product.image,
      category: product.category,
      subCategory: product.subCategory,
      brand: product.brand,
      stock: product.stock,
      quantity: 1,
      createdAt: Date.now(),
    } as CartItem;

    this.store.dispatch(CartActions.addItem({ item }));
  }

  removeItem(id: string): void {
    if (!this.session.uid) return;
    this.store.dispatch(CartActions.removeItem({ id }));
  }

  updateQuantity(id: string, qty: number): void {
    if (!this.session.uid) return;

    if (qty <= 0) {
      this.removeItem(id);
      return;
    }

    this.store.dispatch(CartActions.updateQuantity({ id, quantity: qty }));
  }

  clearCart(): void {
    if (!this.session.uid) return;
    this.store.dispatch(CartActions.clear());
  }

  /** One atomic move; the saved-later slice picks up the server's list from the response. */
  saveForLater(item: CartItem): void {
    if (!this.session.uid) return;
    this.store.dispatch(CartActions.saveForLater({ id: item.id }));
  }

  /** Payment verified — the server already emptied the cart when the order was placed. */
  markOrderPlaced(): void {
    this.store.dispatch(CartActions.orderPlaced());
  }
}
