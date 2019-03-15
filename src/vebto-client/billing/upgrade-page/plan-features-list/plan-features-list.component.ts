import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Plan} from "../../plans/plan";

@Component({
    selector: 'plan-features-list',
    templateUrl: './plan-features-list.component.html',
    styleUrls: ['./plan-features-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PlanFeaturesListComponent {

    @Input() plan: Plan;

    /**
     * Whether "check" icon should be shown next to plan feature.
     */
    @Input() showCheckIcons: boolean = false;

    /**
     * Whether features list should be displayed as dense.
     */
    @Input() dense: boolean = false;

    public getPlan() {
        return this.plan.parent || this.plan;
    }
}
