import {Component, ViewEncapsulation} from '@angular/core';
import {SubscriptionStepperState} from "../../subscriptions/subscription-stepper-state.service";

@Component({
    selector: 'order-summary',
    templateUrl: './order-summary.component.html',
    styleUrls: ['./order-summary.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrderSummaryComponent {

    /**
     * OrderSummaryComponent constructor.
     */
    constructor(public state: SubscriptionStepperState) {}
}
