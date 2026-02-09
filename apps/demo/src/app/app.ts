import { ChangeDetectionStrategy, Component, computed, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoAnimationPlugin, getTransitionSizes } from '@formkit/auto-animate';
import { NgAutoAnimate } from 'ng-auto-animate';

/*
 * This is a helper type only. The original example is in JavaScript, not TypeScript, so no type is exported.
 * Actual values can be any CSS properties.
 */
type KeyframeProps = {
	transform: string;
	opacity?: number;
	offset?: number;
	width?: string;
	height?: string;
};

@Component({
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgAutoAnimate, FormsModule],
	selector: 'ng-auto-animate-root',
	template: `
		<main class="container">
			<hgroup>
				<h2>
					<code>auto-animate</code>
					Directive
				</h2>
				<h3>Wrapper around FormKit's Auto Animate library</h3>
			</hgroup>

			<button (click)="toggleStart()">Start</button>

			<article>
				<header auto-animate>
					<!-- Global default settings: Affects the <a *ngIf> below -->
					@if (showIntro()) {
						<a href="https://github.com/ajitzero/ng-auto-animate/tree/main/libs/ng-auto-animate#readme">
							📝 View README (Slow transition, from global default settings)
						</a>
						<input [(ngModel)]="duration" type="number" />
					}
				</header>
				<div class="grid">
					<button (click)="toggleList()">Toggle (Custom plugin)</button>
					<button [disabled]="!showList()" (click)="shuffle()">Shuffle (Explicit, inline settings)</button>
				</div>
				<footer [auto-animate]="bouncyPlugin">
					<!-- Custom plugin: Affects the <div *ngIf> below, but not its children -->
					<h3>Footer content {{ duration() }}</h3>
					@if (showList()) {
						<ol [auto-animate]="inputOptions()">
							<!-- Explicit, inline setting: Affects the <p *ngFor> below -->
							@for (paragraph of paragraphs(); track paragraph.id) {
								<li>{{ paragraph.desc }}</li>
							}
						</ol>
					}
				</footer>
			</article>
		</main>
	`,
})
export class AppComponent {
	showIntro = signal(false);
	showList = signal(false);

	duration = model(250);
	inputOptions = computed(() => ({ duration: this.duration() }));

	paragraphs = signal([
		{ id: '1', desc: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
		{ id: '2', desc: 'random lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
		{ id: '3', desc: 'ipsum dolor sit amet, consectetur adipiscing elit.' },
		{ id: '4', desc: 'dolor sit amet, consectetur adipiscing elit.' },
	]);

	toggleStart = () => this.showIntro.set(!this.showIntro());
	toggleList = () => this.showList.set(!this.showList());

	shuffle() {
		if (this.showList()) {
			// Replace `Array.prototype.sort()` with `Array.prototype.toSorted()` when it's stable
			this.paragraphs.set([...this.paragraphs()].sort(() => Math.random() - 0.5));
		}
	}

	/**
	 * This example plugin is a modified version of the "bouncy" plugin
	 * showcased in the library's documentation.
	 *
	 * @see https://auto-animate.formkit.com/#plugins
	 */
	bouncyPlugin: AutoAnimationPlugin = (el, action, oldCoords, newCoords) => {
		let keyframes: KeyframeProps[] = [];
		// supply a different set of keyframes for each action
		if (action === 'add') {
			keyframes = [
				{ transform: 'scale(0)', opacity: 0 },
				{ transform: 'scale(1.15)', opacity: 1, offset: 0.75 },
				{ transform: 'scale(1)', opacity: 1 },
			];
		}
		// keyframes can have as many "steps" as you prefer
		// and you can use the 'offset' key to tune the timing
		if (action === 'remove') {
			keyframes = [
				{ transform: 'scale(1)', opacity: 1 },
				{ transform: 'scale(1.15)', opacity: 1, offset: 0.33 },
				{ transform: 'scale(0.75)', opacity: 0.1, offset: 0.5 },
				{ transform: 'scale(0.5)', opacity: 0 },
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
			const start: KeyframeProps = {
				transform: `translate(${deltaX}px, ${deltaY}px)`,
			};
			const mid: KeyframeProps = {
				transform: `translate(${deltaX * -0.15}px, ${deltaY * -0.15}px)`,
				offset: 0.75,
			};
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
		return new KeyframeEffect(el, keyframes, {
			duration: 600,
			easing: 'ease-out',
		});
	};
}
