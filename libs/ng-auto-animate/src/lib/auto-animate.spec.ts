import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgAutoAnimate } from './auto-animate';

@Component({
	standalone: true,
	selector: 'ng-auto-animate-mock-comp',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgAutoAnimate],
	template: `
		<div auto-animate>
			@for (item of data(); track item) {
				<div>Child {{ item }}</div>
			}
		</div>
		<button (click)="updateData()">Add</button>
	`,
})
class MockCompForNgAutoAnimateComponent {
	data = signal([1, 2]);

	updateData() {
		this.data.set([1, 2, 3]);
	}
}

describe('NgAutoAnimate', () => {
	let fixture: ComponentFixture<MockCompForNgAutoAnimateComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [NgAutoAnimate, MockCompForNgAutoAnimateComponent],
		});
		fixture = TestBed.createComponent(MockCompForNgAutoAnimateComponent);
		fixture.detectChanges();
	});

	it('should create an instance', () => {
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should have the correct number of children', () => {
		const component = fixture.componentInstance;
		expect(component.data().length).toBe(2);

		component.updateData();
		fixture.detectChanges();
		expect(component.data().length).toBe(3);
	});
});
