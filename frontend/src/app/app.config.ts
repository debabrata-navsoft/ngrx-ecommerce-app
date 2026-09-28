import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { loadingInterceptor } from './core/loading.interceptor';
import { provideAppStore } from './core/store';
import { LucideAngularModule } from 'lucide-angular';
import { APP_ICONS } from './shared/data/icons.data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),

    // The Node API in server/ is the only backend. withFetch() lets these requests run
    // under SSR too, where ApiService forwards the visitor's cookie.
    // loadingInterceptor drives the global progress bar from HTTP activity, so every page
    // shows a loading indicator for every API call without wiring one up per component.
    provideHttpClient(withFetch(), withInterceptors([loadingInterceptor])),

    provideClientHydration(withEventReplay()),

    // NgRx holds the session, cart, wishlist and saved-later state; the services in
    // core/services are facades over it. See core/store/.
    ...provideAppStore(),

    // Lucide icons, looked up by name from <lucide-icon name="..." />. See shared/data/icons.data.ts.
    importProvidersFrom(LucideAngularModule.pick(APP_ICONS)),
  ],
};
