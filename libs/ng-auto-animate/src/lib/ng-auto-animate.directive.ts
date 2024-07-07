import { AfterViewInit, Directive, ElementRef, InjectionToken, computed, inject, input } from '@angular/core';
import autoAnimate, { AutoAnimateOptions, AutoAnimationPlugin } from '@formkit/auto-animate';

export type AutoAnimationConfig = Partial<AutoAnimateOptions> | AutoAnimationPlugin;
const isPlugin = (config: AutoAnimationConfig) => typeof config === 'function';

export const GLOBAL_AUTO_ANIMATE_OPTIONS = new InjectionToken<AutoAnimationConfig>(
	'Global AutoAnimate Options or Plugin',
	{
		factory: () => ({}),
	},
);

@Directive({
	selector: '[auto-animate]',
	standalone: true,
})
export class NgAutoAnimateDirective implements AfterViewInit {
	private readonly el = inject(ElementRef);
	private readonly globalOptions = inject(GLOBAL_AUTO_ANIMATE_OPTIONS);

	autoAnimateOptions = input<AutoAnimationConfig | string>('', { alias: 'auto-animate' });
	private options = computed(() => {
		const localOptions = this.autoAnimateOptions();
		if (typeof localOptions === 'string') {
			// Default case, when no options or plugin is passed
			return this.globalOptions;
		}
		// When either some options or a plugin is passed
		if (isPlugin(this.globalOptions) || isPlugin(localOptions)) {
			// A plugin must replace any previously set options or plugin.
			// A plugin must be replaced by options or another plugin.
			return localOptions;
		}
		// When plugins are not involved
		return {
			...this.globalOptions,
			...localOptions,
		};
	});

	ngAfterViewInit(): void {
		autoAnimate(this.el.nativeElement, this.options());
	}
}
