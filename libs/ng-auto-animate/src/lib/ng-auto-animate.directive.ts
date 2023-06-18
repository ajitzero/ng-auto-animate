import { AfterViewInit, Directive, ElementRef, Input, inject } from '@angular/core';
import autoAnimate, { AutoAnimateOptions } from '@formkit/auto-animate';


@Directive({
  selector: '[auto-animate]',
  standalone: true,
})
export class NgAutoAnimateDirective implements AfterViewInit {
  private el = inject(ElementRef);

  @Input('auto-animate')
  set options(_options: Partial<AutoAnimateOptions> | '') {
    this._options = typeof _options === 'string' ? {} : _options;
  }
  get options() {
    return this._options;
  }
  private _options: Partial<AutoAnimateOptions> = {};

  ngAfterViewInit(): void {
    this.options = typeof this.options === 'string' ? {} : this.options;
    autoAnimate(this.el.nativeElement, { ...this.options });
  }
}
