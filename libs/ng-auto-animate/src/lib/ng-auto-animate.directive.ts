import { AfterViewInit, Directive, ElementRef, InjectionToken, Input, inject } from '@angular/core';
import autoAnimate, { AutoAnimateOptions, AutoAnimationPlugin } from '@formkit/auto-animate';

const isPlugin = (config: Partial<AutoAnimateOptions> | AutoAnimationPlugin) =>
  typeof config === 'function';

export const GLOBAL_AUTO_ANIMATE_OPTIONS = new InjectionToken<Partial<AutoAnimateOptions> | AutoAnimationPlugin>(
  'Global AutoAnimate Options or Plugin', {
  factory: () => ({}),
});

@Directive({
  selector: '[auto-animate]',
  standalone: true,
})
export class NgAutoAnimateDirective implements AfterViewInit {
  private el = inject(ElementRef);
  private globalOptions = inject(GLOBAL_AUTO_ANIMATE_OPTIONS);

  @Input('auto-animate')
  set explicitOptions(_options: Partial<AutoAnimateOptions> | AutoAnimationPlugin | string) {
    if (typeof _options === 'string') {
      // Default case, when no options or plugin is passed
      this._options = this.globalOptions;
    } else {
      // When either some options or a plugin is passed
      if (isPlugin(this.globalOptions) || isPlugin(_options)) {
        // A plugin must replace any previously set options or plugin.
        // A plugin must be replaced by options or another plugin.
        this._options = _options;
      } else {
        // When plugins are not involved
        this._options = {
          ...this.globalOptions,
          ..._options,
        };
      }
    }
  }
  get options() {
    return this._options;
  }
  private _options: Partial<AutoAnimateOptions> | AutoAnimationPlugin = {};

  ngAfterViewInit(): void {
    autoAnimate(this.el.nativeElement, this.options);
  }
}
