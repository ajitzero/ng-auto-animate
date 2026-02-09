import { InjectionToken, Provider } from '@angular/core';
import type { AutoAnimateOptions, AutoAnimationPlugin } from '@formkit/auto-animate';

export type AutoAnimationConfig = Partial<AutoAnimateOptions> | AutoAnimationPlugin;

export const AUTO_ANIMATE_CONFIG = new InjectionToken<AutoAnimationConfig>('Global AutoAnimate Options or Plugin', {
	factory: () => ({}),
});

export function provideAutoAnimateConfig(config: AutoAnimationConfig): Provider[] {
	return [{ provide: AUTO_ANIMATE_CONFIG, useValue: config }];
}
