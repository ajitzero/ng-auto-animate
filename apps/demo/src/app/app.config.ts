import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideAutoAnimateConfig } from 'ng-auto-animate';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideAutoAnimateConfig({ duration: 1000 }),
		provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
		provideZonelessChangeDetection(),
	],
};
