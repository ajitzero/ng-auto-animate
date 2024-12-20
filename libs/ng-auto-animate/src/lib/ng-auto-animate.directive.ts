import {
	Directive,
	ElementRef,
	InjectionToken,
	Injector,
	afterNextRender,
	computed,
	effect,
	inject,
	input,
} from '@angular/core';
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
export class NgAutoAnimateDirective {
	private readonly _injector = inject(Injector);
	private readonly _elementRef = inject(ElementRef);
	private readonly _globalOptions = inject(GLOBAL_AUTO_ANIMATE_OPTIONS);

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
