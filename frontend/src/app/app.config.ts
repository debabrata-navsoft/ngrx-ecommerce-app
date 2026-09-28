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

    provideHttpClient(withFetch(), withInterceptors([loadingInterceptor])),

    provideClientHydration(withEventReplay()),

    ...provideAppStore(),

    importProvidersFrom(LucideAngularModule.pick(APP_ICONS)),
  ],
};
