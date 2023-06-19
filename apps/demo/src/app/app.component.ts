import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AutoAnimationPlugin, getTransitionSizes } from '@formkit/auto-animate';
import { NgAutoAnimateDirective } from 'ng-auto-animate';

type KeyframeProps = {
  transform: string;
  opacity?: number;
  offset?: number;
  width?: string;
  height?: string;
};

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NgAutoAnimateDirective],
  selector: 'ng-auto-animate-root',
  template: `
    <main class="container">
      <hgroup>
        <h2><code>auto-animate</code> Directive</h2>
        <h3>Wrapper around FormKit's Auto Animate library</h3>
      </hgroup>

      <button (click)="start = !start">Start</button>

      <article>
        <header auto-animate> <!-- Global default settings -->
          <a *ngIf="start" href="https://github.com/ajitzero/ng-auto-animate/tree/main/libs/ng-auto-animate#readme">📝 View README (Slow transition, from global default settings)</a>
        </header>
        <div class="grid">
          <button (click)="show = !show">Toggle (Custom plugin)</button>
          <button (click)="shuffle()">Shuffle (Explicit, inline settings)</button>
        </div>
        <footer [auto-animate]="bouncyPlugin"> <!-- Custom plugin -->
          <h3>Footer content</h3>
          <div *ngIf="show" [auto-animate]="{ duration: 250 }"> <!-- Explicit, inline setting -->
            <p *ngFor="let paragraph of paragraphs">{{ paragraph }}</p>
          </div>
        </footer>
      </article>
    </main>
  `,
})
export class AppComponent {
  title = 'Demo';
  start = false;
  show = false;

  paragraphs = [
    '1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    '2. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    '3. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    '4. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  ];

  shuffle() {
    if (this.show) {
      this.paragraphs = this.paragraphs.sort(() => Math.random() - 0.5);
    }
  }

  /**
   * This example plugin is a modified version of the "bouncy" plugin
   * showcased in the the library's documentation.
   */
  bouncyPlugin: AutoAnimationPlugin = (el, action, oldCoords, newCoords) => {
    let keyframes: KeyframeProps[] = [];
    // supply a different set of keyframes for each action
    if (action === 'add') {
      keyframes = [
        { transform: 'scale(0)', opacity: 0 },
        { transform: 'scale(1.15)', opacity: 1, offset: 0.75 },
        { transform: 'scale(1)', opacity: 1 }
      ];
    }
    // keyframes can have as many "steps" as you prefer
    // and you can use the 'offset' key to tune the timing
    if (action === 'remove') {
      keyframes = [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.15)', opacity: 1, offset: 0.33 },
        { transform: 'scale(0.75)', opacity: 0.1, offset: 0.5 },
        { transform: 'scale(0.5)', opacity: 0 }
      ];
    }
    if (action === 'remain' && oldCoords !== undefined && newCoords !== undefined) {
      // for items that remain, calculate the delta
      // from their old position to their new position
      const deltaX = oldCoords.left - newCoords?.left;
      const deltaY = oldCoords.top - newCoords?.top;
      // use the getTransitionSizes() helper function to
      // get the old and new widths of the elements
      const [widthFrom, widthTo, heightFrom, heightTo] = getTransitionSizes(el, oldCoords, newCoords);
      // set up our steps with our positioning keyframes
      const start: KeyframeProps = { transform: `translate(${deltaX}px, ${deltaY}px)` };
      const mid: KeyframeProps = { transform: `translate(${deltaX * -0.15}px, ${deltaY * -0.15}px)`, offset: 0.75 };
      const end: KeyframeProps = { transform: `translate(0, 0)` };
      // if the dimensions changed, animate them too.
      if (widthFrom !== widthTo) {
        start.width = `${widthFrom}px`;
        mid.width = `${widthFrom >= widthTo ? widthTo / 1.05 : widthTo * 1.05}px`;
        end.width = `${widthTo}px`;
      }
      if (heightFrom !== heightTo) {
        start.height = `${heightFrom}px`;
        mid.height = `${heightFrom >= heightTo ? heightTo / 1.05 : heightTo * 1.05}px`;
        end.height = `${heightTo}px`;
      }
      keyframes = [start, mid, end];
    }
    // return our KeyframeEffect() and pass
    // it the chosen keyframes.
    return new KeyframeEffect(el, keyframes, { duration: 600, easing: 'ease-out' });
  };
}
