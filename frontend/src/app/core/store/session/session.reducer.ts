import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { User } from '../../../shared/models/user.model';
import { SessionActions } from './session.actions';

export interface SessionState {
  // `undefined` means "not resolved yet" and is load-bearing: SessionService.user$ withholds
  // it, so a guard's take(1) waits for /auth/me instead of seeing a premature null.
  user: User | null | undefined;
}

const initialState: SessionState = { user: undefined };

export const sessionFeature = createFeature({
  name: 'session',
  reducer: createReducer(
    initialState,
    on(SessionActions.settled, (_state, { user }): SessionState => ({ user })),
  ),
  extraSelectors: ({ selectUser }) => ({
    selectCurrentUser: createSelector(selectUser, (user) => user ?? null),
    selectIsReady: createSelector(selectUser, (user) => user !== undefined),
  }),
});
