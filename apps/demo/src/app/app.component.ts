import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgAutoAnimateDirective } from 'ng-auto-animate';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NgAutoAnimateDirective],
  selector: 'ng-auto-animate-root',
  template: `
    <main class="container">
      <hgroup>
        <h2>NgAutoAnimateDirective</h2>
        <h3>Wrapper around FormKit's Auto Animate library</h3>
      </hgroup>

      <article>
        <button (click)="show = !show">Toggle</button>
        <button (click)="shuffle()">Shuffle</button>
        <footer [auto-animate]="{ duration: 250 }">
          <h3>Footer content</h3>
          <div *ngIf="show" auto-animate>
            <p *ngFor="let paragraph of paragraphs">{{ paragraph }}</p>
          </div>
        </footer>
      </article>
    </main>
  `,
})
export class AppComponent {
  title = 'Demo';
  show = false;

  paragraphs = [
    '1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    '2. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    '3. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    '4. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    '5. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    '6. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    '7. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  ];

  shuffle() {
    if (this.show) {
      this.paragraphs = this.paragraphs.sort(() => Math.random() - 0.5);
    }
  }
}
