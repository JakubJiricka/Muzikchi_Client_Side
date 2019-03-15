import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Subscriptions} from "../subscriptions.service";
import {Plan} from "../../plans/plan";
import {CreditCard} from "../../upgrade-page/upgrade-page.component";
import {PaypalSubscriptions} from "../paypal-subscriptions";
import {Subscription} from "../subscription";
import {CurrentUser} from '../../../auth/current-user';
import {Toast} from '../../../core/ui/toast.service';
import {Settings} from '../../../core/config/settings.service';
import {User} from '../../../core/types/models/User';

@Component({
    selector: 'create-subscription-panel',
    templateUrl: './create-subscription-panel.component.html',
    styleUrls: ['./create-subscription-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CreateSubscriptionPanelComponent {

    /**
     * Whether subscription creation is in progress.
     */
    public _loading: boolean = false;

    /**
     * Fired when subscription creation starts or ends.
     */
    @Output() loading: EventEmitter<boolean> = new EventEmitter();

    /**
     * Text for submit purchase button.
     */
    @Input() submitText = 'Submit Purchase';

    /**
     * Whether paypal tab should be disabled.
     */
    @Input() disablePaypalTab: boolean = false;

    /**
     * We're changing user subscription from this one.
     * Used for prorating the new subscription start date.
     */
    @Input() from: Subscription;

    /**
     * Plan user should be subscribed to.
     */
    @Input() plan: Plan;

    /**
     * Fired when subscription is created or updated.
     */
    @Output() completed: EventEmitter<SubscriptionCompletedEvent> = new EventEmitter();

    /**
     * Errors returned from backend.
     */
    public errors: object = {};

    /**
     * CreateSubscriptionTabsComponent constructor.
     */
    constructor(
        private subscriptions: Subscriptions,
        private currentUser: CurrentUser,
        private paypal: PaypalSubscriptions,
        private toast: Toast,
        public settings: Settings,
    ) {}

    /**
     * Subscribe user to current plan on stripe gateway.
     */
    public subscribeOnStripe() {
        //if user is already subscribed to this plan, fire "updated" event and bail
        if (this.currentUser.getSubscription({gateway: 'stripe', planId: this.plan.id})) {
            return this.completed.emit({status: 'updated'});
        }

        this.startLoading();

        this.subscriptions.createOnStripe(this.getNewSubscriptionPayload())
            .subscribe(response => {
                this.completeSubscription(response.user);
            }, response => {
                this.errors = response.messages;
                this.stopLoading();
            });
    }

    /**
     * Subscribe user to current plan on paypal gateway.
     */
    public subscribeOnPaypal() {
        //if user is already subscribed to this plan, fire "updated" event and bail
        if (this.currentUser.getSubscription({gateway: 'paypal', planId: this.plan.id})) {
            return this.completed.emit({status: 'updated'});
        }

        this.startLoading();

        this.paypal.subscribe(this.getNewSubscriptionPayload()).then(user => {
            this.completeSubscription(user);
        }).catch(message => {
            this.stopLoading();
            this.toast.open(message || 'There was an issue. Please try again later.');
        });
    }

    /**
     * Get payload for backend for creating a new subscription.
     */
    private getNewSubscriptionPayload(): NewSubscriptionPayload {
       const payload = {plan_id: this.plan.id};

       if (this.from) {
           payload['start_date'] = this.from.renews_at;
       }

       return payload
    }

    /**
     * Complete subscription creation.
     */
    private completeSubscription(user: User) {
        this._loading = false;
        this.currentUser.assignCurrent(user);
        this.completed.emit({status: 'created'})
    }

    /**
     * Mark component as loading.
     */
    private startLoading() {
        this._loading = true;
        this.loading.emit(true);
    }

    /**
     * Mark component as not loading.
     */
    private stopLoading() {
        this._loading = false;
        this.loading.emit(false);
    }
}

export interface SubscriptionCompletedEvent {
    status: 'created'|'updated'
}

interface NewSubscriptionPayload {
    card?: CreditCard;
    start_date?: string;
    plan_id: number;
}
