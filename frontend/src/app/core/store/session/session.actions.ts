import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { User } from '../../../shared/models/user.model';

export const SessionActions = createActionGroup({
  source: 'Session',
  events: {
    Refresh: emptyProps(),
    // Every login, signup, logout, profile save and /auth/me response lands here. The list
    // slices (cart, wishlist, saved-later) listen to it to load or reset themselves.
    Settled: props<{ user: User | null }>(),
  },
});
