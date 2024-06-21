import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { GLOBAL_AUTO_ANIMATE_OPTIONS } from 'ng-auto-animate';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		{ provide: GLOBAL_AUTO_ANIMATE_OPTIONS, useValue: { duration: 1000 } },
		provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
		provideExperimentalZonelessChangeDetection(),
	],
};
