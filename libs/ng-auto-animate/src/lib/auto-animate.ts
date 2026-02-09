import {
	Directive,
	ElementRef,
	Injector,
	afterNextRender,
	booleanAttribute,
	computed,
	effect,
	inject,
	input,
} from '@angular/core';
import autoAnimate from '@formkit/auto-animate';
import { isPlugin } from './is-plugin';
import { type AutoAnimationConfig, AUTO_ANIMATE_CONFIG } from './tokens';

@Directive({ selector: '[auto-animate]' })
export class NgAutoAnimate {
	private readonly _injector = inject(Injector);
	private readonly _elementRef = inject(ElementRef);
	private readonly _globalOptions = inject(AUTO_ANIMATE_CONFIG);

	public readonly disableAutoAnimate = input(false, { transform: booleanAttribute });
	public readonly autoAnimateOptions = input<AutoAnimationConfig | string>('', { alias: 'auto-animate' });

	private readonly _options = computed(() => {
		const disabled = this.disableAutoAnimate();
		const localOptions = this.autoAnimateOptions();

		if (disabled) {
			// Exit early. These options won't be passed anyway.
			return {};
		}

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
					const disabled = this.disableAutoAnimate();
					const options = this._options();

					if (!disabled) {
						autoAnimate(this._elementRef.nativeElement, options);
					}
				},
				{ injector: this._injector },
			);
		});
	}
}
