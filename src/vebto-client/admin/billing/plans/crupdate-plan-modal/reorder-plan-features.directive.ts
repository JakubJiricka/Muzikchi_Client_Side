
import {AfterContentInit, Directive, ElementRef, Input} from '@angular/core';
import {mapOrder} from '../../../../core/utils/map-order';
import * as Sortable from 'sortablejs';

@Directive({
    selector: '[reorderPlanFeatures]'
})
export class ReorderPlanFeaturesDirective implements AfterContentInit {
    @Input('reorderPlanFeatures') features;

    /**
     * ReorderPlanFeaturesDirective Constructor.
     */
    constructor(
        private el: ElementRef,
    ) {}

    ngAfterContentInit() {
        new Sortable(this.el.nativeElement, {
            draggable: '.mat-list-item',
            animation: 250,
            onUpdate: () => {
                const items = this.el.nativeElement.querySelectorAll('.mat-list-item'), ids = [];

                for (let i = 0; i < items.length; i++) {
                    ids.push(items[i].dataset.id);
                }

                this.features = mapOrder(this.features, ids, 'id');
            }
        });
    }
}
