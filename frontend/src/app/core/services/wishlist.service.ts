import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { SessionService } from './session.service';
import { Product } from '../../shared/models/product.model';
import { WishlistActions } from '../store/wishlist/wishlist.actions';
import { wishlistFeature } from '../store/wishlist/wishlist.reducer';

/** Facade over the `wishlist` store slice. See wishlist.effects.ts for the requests. */
@Injectable({ providedIn: 'root' })
export class WishlistService {
  private store = inject(Store);
  private session = inject(SessionService);

  itemCount = this.store.selectSignal(wishlistFeature.selectItemCount);
  getWishlistSignal = this.store.selectSignal(wishlistFeature.selectItems);

  loadWishlist(): void {
    this.store.dispatch(WishlistActions.load());
  }

  addToWishlist(product: Product): void {
    if (!this.session.uid) return;
    if (this.isInWishlist(product.id)) return;

    this.store.dispatch(WishlistActions.add({ product: { ...product, createdAt: Date.now() } }));
  }

  removeFromWishlist(id: string): void {
    if (!this.session.uid) return;
    this.store.dispatch(WishlistActions.remove({ id }));
  }

  isInWishlist(id: string | undefined): boolean {
    if (!id) return false;
    return this.getWishlistSignal().some((p) => p.id === id);
  }
}
