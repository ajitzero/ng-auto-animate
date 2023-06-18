import { AfterViewInit, Directive, ElementRef, InjectionToken, Input, inject } from '@angular/core';
import autoAnimate, { AutoAnimateOptions } from '@formkit/auto-animate';

export const GLOBAL_AUTO_ANIMATE_OPTIONS = new InjectionToken<Partial<AutoAnimateOptions>>(
  'Global AutoAnimate Options', {
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
  set options(_options: Partial<AutoAnimateOptions> | '') {
    this._options = {
      ...this.globalOptions,
      ...(typeof _options === 'string' ? {} : _options),
    };
  }
  get options() {
    return this._options;
  }
  private _options: Partial<AutoAnimateOptions> = {};

  ngAfterViewInit(): void {
    autoAnimate(this.el.nativeElement, { ...this.options });
  }
}
