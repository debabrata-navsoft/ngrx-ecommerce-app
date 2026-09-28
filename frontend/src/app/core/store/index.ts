import { EnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

import * as cartEffects from './cart/cart.effects';
import { cartFeature } from './cart/cart.reducer';
import * as savedLaterEffects from './saved-later/saved-later.effects';
import { savedLaterFeature } from './saved-later/saved-later.reducer';
import * as sessionEffects from './session/session.effects';
import { sessionFeature } from './session/session.reducer';
import * as wishlistEffects from './wishlist/wishlist.effects';
import { wishlistFeature } from './wishlist/wishlist.reducer';

export function provideAppStore(): EnvironmentProviders[] {
  return [
    provideStore({
      [sessionFeature.name]: sessionFeature.reducer,
      [cartFeature.name]: cartFeature.reducer,
      [wishlistFeature.name]: wishlistFeature.reducer,
      [savedLaterFeature.name]: savedLaterFeature.reducer,
    }),
    provideEffects(sessionEffects, cartEffects, wishlistEffects, savedLaterEffects),
  ];
}
