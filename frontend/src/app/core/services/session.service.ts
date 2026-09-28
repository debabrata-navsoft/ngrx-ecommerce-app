import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';

import { User } from '../../shared/models/user.model';
import { SessionActions } from '../store/session/session.actions';
import { sessionFeature } from '../store/session/session.reducer';

/**
 * Facade over the `session` store slice. The initial /auth/me call is made by the session
 * effects on ROOT_EFFECTS_INIT, not by this constructor.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private store = inject(Store);

  readonly user$: Observable<User | null> = this.store
    .select(sessionFeature.selectUser)
    .pipe(filter((value): value is User | null => value !== undefined));

  readonly user = this.store.selectSignal(sessionFeature.selectCurrentUser);
  readonly isReady = this.store.selectSignal(sessionFeature.selectIsReady);

  refresh(): void {
    this.store.dispatch(SessionActions.refresh());
  }

  settle(user: User | null): void {
    this.store.dispatch(SessionActions.settled({ user }));
  }

  clear(): void {
    this.settle(null);
  }

  get uid(): string | undefined {
    return this.user()?.uid;
  }
}
