import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscriptions} from "../subscriptions/subscriptions.service";
import {MatStepper} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {SubscriptionStepperState} from "../subscriptions/subscription-stepper-state.service";
import {Settings} from '../../core/config/settings.service';
import {Toast} from '../../core/ui/toast.service';

@Component({
    selector: 'upgrade-page',
    templateUrl: './upgrade-page.component.html',
    styleUrls: ['./upgrade-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [SubscriptionStepperState],
})
export class UpgradePageComponent implements OnInit {
    @ViewChild(MatStepper) stepper: MatStepper;

    /**
     * Whether server request is in progress.
     */
    public loading = false;

    /**
     * SelectPlanModalComponent Constructor.
     */
    constructor(
        private subscriptions: Subscriptions,
        private route: ActivatedRoute,
        public settings: Settings,
        private router: Router,
        private toast: Toast,
        public state: SubscriptionStepperState,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.state.setPlans(data.plans);
        });
    }

    /**
     * Move to next "upgrade" stepper step.
     */
    public nextStep() {
        this.stepper.next();
    }

    /**
     * Fired when user subscribed to one of the plans successfully.
     */
    public onCompleted() {
        this.loading = false;
        this.router.navigate(['/dashboard']);
        this.toast.open('Subscribed to "'+this.getSelectedOrParentPlanName()+'" plan successfully.');
    }

    /**
     * Get name of selected plan or it's parent.
     */
    private getSelectedOrParentPlanName(): string {
        const plan = this.state.selectedPlan.parent ? this.state.selectedPlan.parent : this.state.selectedPlan;
        return plan.name;
    }
}

export interface CreditCard {
    number?: number|string,
    expiration_month?: number|string,
    expiration_year?: number|string,
    security_code?: number|string,
}