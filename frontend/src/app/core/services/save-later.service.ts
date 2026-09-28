import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { SessionService } from './session.service';
import { CartItem } from '../../shared/models/cart.model';
import { CartService } from './cart.service';
import { SavedLaterActions } from '../store/saved-later/saved-later.actions';
import { savedLaterFeature } from '../store/saved-later/saved-later.reducer';

/** Facade over the `savedLater` store slice. See saved-later.effects.ts for the requests. */
@Injectable({ providedIn: 'root' })
export class SaveLaterService {
  private store = inject(Store);
  private session = inject(SessionService);
  private cartService = inject(CartService);

  savedLater = this.store.selectSignal(savedLaterFeature.selectItems);
  itemCount = this.store.selectSignal(savedLaterFeature.selectItemCount);

  loadSavedLater(): void {
    this.store.dispatch(SavedLaterActions.load());
  }

  saveForLater(item: CartItem): void {
    this.cartService.saveForLater(item);
  }

  /** Atomic: the response carries both lists. Never follow it with addToCart. */
  moveToCart(item: CartItem): void {
    if (!this.session.uid) return;
    this.store.dispatch(SavedLaterActions.moveToCart({ id: item.id }));
  }

  removeFromSaved(id: string): void {
    if (!this.session.uid) return;
    this.store.dispatch(SavedLaterActions.remove({ id }));
  }

  addToSaved(productId: string): void {
    if (!this.session.uid) return;
    this.store.dispatch(SavedLaterActions.add({ productId }));
  }
}
