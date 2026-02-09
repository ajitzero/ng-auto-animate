import { Directive, ElementRef, Injector, afterNextRender, computed, effect, inject, input } from '@angular/core';
import autoAnimate from '@formkit/auto-animate';
import { isPlugin } from './is-plugin';
import { type AutoAnimationConfig, AUTO_ANIMATE_CONFIG } from './tokens';

@Directive({ selector: '[auto-animate]' })
export class NgAutoAnimate {
	private readonly _injector = inject(Injector);
	private readonly _elementRef = inject(ElementRef);
	private readonly _globalOptions = inject(AUTO_ANIMATE_CONFIG);

	public readonly autoAnimateOptions = input<AutoAnimationConfig | string>('', { alias: 'auto-animate' });
	private readonly _options = computed(() => {
		const localOptions = this.autoAnimateOptions();

		if (typeof localOptions === 'string') {
			// Default case, when no options or plugin is passed
			return this._globalOptions;
		}

		// When either some options or a plugin is passed
		if (isPlugin(this._globalOptions) || isPlugin(localOptions)) {
			// A plugin must replace any previously set options or plugin.
			// A plugin must be replaced by options or another plugin.
			return localOptions;
		}

		// When plugins are not involved
		return {
			...this._globalOptions,
			...localOptions,
		};
	});

	constructor() {
		afterNextRender(() => {
			effect(
				() => {
					autoAnimate(this._elementRef.nativeElement, this._options());
				},
				{ injector: this._injector },
			);
		});
	}
}
