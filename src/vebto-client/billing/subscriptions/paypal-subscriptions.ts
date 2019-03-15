import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Subscription} from "./subscription";
import {Plan} from "../plans/plan";
import {Subscriptions} from "./subscriptions.service";
import {AppHttpClient} from '../../core/http/app-http-client.service';
import {Settings} from '../../core/config/settings.service';
import {User} from '../../core/types/models/User';

@Injectable()
export class PaypalSubscriptions {

    private popupWidth = 450;
    private popupHeight = 650;

    /**
     * Params for popup window.
     */
    private popupParams = {
        menubar: 0,
        location: 0,
        toolbar: 0,
        titlebar: 0,
        status: 0,
        scrollbars: 1,
        width: this.popupWidth,
        height: this.popupHeight
    };

    //TODO: clean this up with rxjs or checkout.js
    private resolveSubscribe: Function;
    private rejectSubscribe: Function;
    private subscriptionPending = false;

    /**
     * PaypalSubscriptions constructor.
     */
    constructor(
        private http: AppHttpClient,
        private settings: Settings,
        private subscriptions: Subscriptions,
    ) {}

    /**
     * Subscribe to specified plan on paypal.
     */
    public subscribe(params: {plan_id: number, start_date?: string}): Promise<User> {
        this.subscriptionPending = true;

        return new Promise((resolve, reject) => {
            this.rejectSubscribe = reject;
            this.resolveSubscribe = resolve;

            this.createPaypalAgreement(params).subscribe(response => {
                this.listenForMessages(params.plan_id);
                this.openPaypalPopup(response.urls.approve);
            }, () => this.rejectSubscriptionPromise());
        });
    }

    /**
     * Change plan of subscription to specified one.
     */
    public changePlan(subscription: Subscription, plan: Plan): Promise<User> {
        return new Promise(resolve => {
            this.subscriptions.cancel(subscription.id, {delete: true}).subscribe(() => {
                this.subscribe({plan_id: plan.id, start_date: subscription.renews_at}).then(user => resolve(user));
            });
        });
    }

    /**
     * Listen for messages from paypal window and execute paypal agreement.
     */
    private listenForMessages(planId: number) {
        window.addEventListener('message', e => {
            if (this.settings.getBaseUrl().indexOf(e.origin) === -1) return;

            //user cancelled payment on paypal popup manually
            if (e.data.status !== 'success') {
                return this.rejectSubscriptionPromise();
            }

            //user approved payment
            this.executePaypalAgreement(e.data.token, planId)
                .subscribe(response => this.resolveSubscriptionPromise(response.user));
        }, false);
    }

    /**
     * Open new paypal express popup window.
     */
    private openPaypalPopup(url: string) {
        const params = Object.assign({}, this.popupParams, {
            left: (screen.width/2)-(this.popupWidth/2),
            top: (screen.height/2)-(this.popupHeight/2)
        });

        const newWindow = window.open(
            url,
            'Authenticate PayPal',
            Object.keys(params).map(key => key+'='+params[key]).join(', '),
        );

        const interval = setInterval(() => {
            if (newWindow == null || newWindow.closed) {
                window.clearInterval(interval);

                if (this.subscriptionPending) {
                    this.rejectSubscriptionPromise();
                }
            }
        }, 1000);
    }

    private createPaypalAgreement(params: {plan_id: number, start_date?: string}): Observable<{urls: {execute: string, approve: string}}> {
        return this.http.post('billing/subscriptions/paypal/agreement/create', {plan_id: params.plan_id, start_date: params.start_date});
    }

    private executePaypalAgreement(agreement_id: string, plan_id: number): Observable<{user: User}> {
        return this.http.post('billing/subscriptions/paypal/agreement/execute', {agreement_id, plan_id});
    }

    /**
     * Reject subscription promise.
     */
    private rejectSubscriptionPromise() {
        this.rejectSubscribe('Payment cancelled on paypal.');
        this.subscriptionPending = false;
    }

    /**
     * Resolve subscription promise.
     */
    private resolveSubscriptionPromise(user: User) {
        this.resolveSubscribe(user);
        this.subscriptionPending = false;
    }
}