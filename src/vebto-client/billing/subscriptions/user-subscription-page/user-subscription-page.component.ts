import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscriptions} from "../subscriptions.service";
import {Plan} from "../../plans/plan";
import {share, finalize} from "rxjs/operators";
import {Subscription} from "../subscription";
import {SelectPlanModalComponent} from "../../plans/select-plan-modal/select-plan-modal.component";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {SubscriptionCompletedEvent} from "../create-subscription-panel/create-subscription-panel.component";
import {PaypalSubscriptions} from "../paypal-subscriptions";
import {Modal} from '../../../core/ui/modal.service';
import {CurrentUser} from '../../../auth/current-user';
import {Toast} from '../../../core/ui/toast.service';
import {ConfirmModalComponent} from '../../../core/ui/confirm-modal/confirm-modal.component';
import {User} from '../../../core/types/models/User';
import {Settings} from '../../../core/config/settings.service';

@Component({
    selector: 'user-subscription-page',
    templateUrl: './user-subscription-page.component.html',
    styleUrls: ['./user-subscription-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UserSubscriptionPageComponent implements OnInit {

    public loading: boolean = false;

    /**
     * Currently active user's subscription.
     */
    public activeSubscription: Subscription;

    constructor(
        public settings: Settings,
        private modal: Modal,
        private subscriptions: Subscriptions,
        public currentUser: CurrentUser,
        private toast: Toast,
        private route: ActivatedRoute,
        private paypalSubscriptions: PaypalSubscriptions,
    ) {}

    ngOnInit() {
        this.activeSubscription = this.currentUser.getSubscription();
    }

    public canResume() {
        return this.currentUser.onGracePeriod();
    }

    public canCancel() {
        return this.currentUser.isSubscribed() && !this.currentUser.onGracePeriod();
    }

    public getFormattedEndDate(): string {
        if ( ! this.activeSubscription.ends_at) return null;
        return this.activeSubscription.ends_at.split(' ')[0];
    }

    public getFormattedRenewDate() {
        if ( ! this.activeSubscription.renews_at) return null;
        return this.activeSubscription.renews_at.split(' ')[0];
    }

    public getPlan(): Plan {
        return this.activeSubscription.plan;
    }

    /**
     * Ask user to confirm deletion of selected templates
     * and delete selected templates if user confirms.
     */
    public maybeCancelSubscription() {
        this.modal.open(ConfirmModalComponent, {
            title: 'Cancel Subscription',
            body: 'Are you sure you want to cancel your subscription?',
            ok: 'Yes, Cancel',
            cancel: 'Go Back'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.cancelSubscription().subscribe(() => {
                this.toast.open('Subscription cancelled.');
            });
        });
    }

    /**
     * Show modal for selecting a new billing plan.
     */
    public showSelectPlanModal() {
        const params = {plans: this.route.snapshot.data.plans};

        this.modal.open(SelectPlanModalComponent, params, 'select-plan-modal-container')
        .afterClosed().subscribe(plan => {
            if ( ! plan) return;
            this.changePlan(plan);
        });
    }

    /**
     * Change user's active subscription plan to specified one.
     */
    public changePlan(plan: Plan) {
        if (this.activeSubscription.plan_id === plan.id) return;

        this.loading = true;

        if (this.activeSubscription.gateway === 'paypal') {
            this.paypalSubscriptions.changePlan(this.activeSubscription, plan).then(user => {
                this.loading = false;
                this.updateUserAndSubscription(user);
                this.toast.open('Subscription plan changed.');
            })
        } else {
            this.subscriptions
                .changePlan(this.activeSubscription.id, plan)
                .pipe(finalize(() => this.loading = false))
                .subscribe(response => {
                    this.updateUserAndSubscription(response['user']);
                    this.toast.open('Subscription plan changed.');
                });
        }
    }

    /**
     * Resume cancelled subscription.
     */
    public resumeSubscription() {
        this.loading = true;

        this.subscriptions.resume(this.activeSubscription.id)
            .pipe(finalize(() => this.loading = false))
            .subscribe(response => {
                this.currentUser.setSubscription(response.subscription);
                this.activeSubscription = this.currentUser.getSubscription();
                this.toast.open('Subscription resumed.');
            });
    }

    /**
     * Called after user payment method for active subscription has been changed successfully.
     */
    public onPaymentMethodChange(e: SubscriptionCompletedEvent) {
        //if we've only changed customer card information on same
        //payment gateway, show success message and bail
        if (e.status === 'updated') {
            this.toast.open('Payment method updated.');
            return;
        }

        this.loading = true;

        //otherwise cancel user's subscription on the other gateway
        this.cancelSubscription({delete: true}).subscribe(() => {
            this.toast.open('Payment method updated.');
        });
    }

    /**
     * Cancel currently active user subscription.
     */
    private cancelSubscription(params: {delete?: boolean} = {}): Observable<{user: User}> {
        this.loading = true;

        const request = this.subscriptions.cancel(this.activeSubscription.id, {delete: params.delete})
            .pipe(finalize(() => this.loading = false))
            .pipe(share());

        request.subscribe(response => {
            //set new active subscription, if user had more then one
            this.updateUserAndSubscription(response.user);
        });

        return request;
    }

    /**
     * Update current user and active subscription.
     */
    private updateUserAndSubscription(user: User) {
        this.currentUser.assignCurrent(user);
        this.activeSubscription = this.currentUser.getSubscription();
    }
}
