import {Component, Input, ViewEncapsulation, HostBinding} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'loading-indicator',
    styleUrls: ['./loading-indicator.component.scss'],
    template:
`<div class="spinner" *ngIf="isVisible">
  <div class="rect rect1"></div>
  <div class="rect rect2"></div>
  <div class="rect rect3"></div>
  <div class="rect rect4"></div>
  <div class="rect rect5"></div>
</div>`,
    animations: [
        trigger('visibility', [
            state('true', style({
                backgroundColor: '*',
                display: 'block',
            })),
            state('false', style({
                backgroundColor: 'transparent',
                display: 'none'
            })),
            transition('true <=> false', animate('225ms cubic-bezier(.4,0,.2,1)'))
        ]),
    ],
    encapsulation: ViewEncapsulation.None,
})
export class LoadingIndicatorComponent {
    @HostBinding('@visibility') @Input() isVisible = false;

    public show() {
        this.isVisible = true;
    }

    public hide() {
        this.isVisible = false;
    }

    public toggle() {
        this.isVisible = !this.isVisible;
    }
}
