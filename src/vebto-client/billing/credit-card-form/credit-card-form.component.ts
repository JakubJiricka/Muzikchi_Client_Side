import {Component, EventEmitter, Input, NgZone, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {Subscriptions} from "../subscriptions/subscriptions.service";
import {finalize} from "rxjs/operators";
import {User} from "../../core/types/models/User";
import {Settings} from "../../core/config/settings.service";
import {LazyLoaderService} from "../../core/utils/lazy-loader.service";
import {CurrentUser} from "../../auth/current-user";

@Component({
    selector: 'credit-card-form',
    templateUrl: './credit-card-form.component.html',
    styleUrls: ['./credit-card-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CreditCardFormComponent implements OnDestroy {

    /**
     * Event fired when form is submitted and card is added successfully on active gateway.
     */
    @Output() created: EventEmitter<User> = new EventEmitter();

    /**
     * Display text for form submit button.
     */
    @Input() submitButtonText: string = 'Submit';

    /**
     * Whether form submit button should be shown.
     */
    @Input() showSubmitButton: boolean = true;

    /**
     * Whether order summary should be shown in the template.
     */
    @Input() showOrderSummary: boolean = false;

    /**
     * Whether backend request is in progress.
     */
    public loading: boolean = false;

    /**
     * Errors returned from backend.
     */
    public error: string;

    /**
     * Mounted stripe elements.
     */
    private stripeElements: stripe.elements.Element[] = [];

    /**
     * Stripe.js instance.
     */
    private stripe: stripe.Stripe;

    /**
     * CreditCardFormComponent Constructor.
     */
    constructor(
        private subscriptions: Subscriptions,
        private currentUser: CurrentUser,
        private settings: Settings,
        private zone: NgZone,
        private lazyLoader: LazyLoaderService,
    ) {
        this.resetForm();
    }

    ngAfterViewInit() {
        this.initStripe();
    }

    ngOnDestroy() {
        this.destroyStripe();
    }

    /**
     * Submit stripe elements credit card form.
     */
    public async submitForm() {
        this.loading = true;

        const {token, error} = await this.stripe.createToken(this.stripeElements[0]);

        if (error) {
            this.error = error.message;
            this.loading = false;
        } else {
            this.addCardToUser(token);
        }
    }

    public addCardToUser(stripeToken: stripe.Token) {
        this.loading = true;

        this.subscriptions.addCard(stripeToken.id)
            .pipe(finalize(() => this.loading = false))
            .subscribe(response => {
                this.resetForm();
                this.currentUser.assignCurrent(response.user);
                this.created.emit(response.user);
            }, response => {
                this.error = response.messages.general;
            });
    }

    /**
     * Initiate stripe elements credit card form.
     */
    private initStripe() {
        this.lazyLoader.loadScript('https://js.stripe.com/v3').then(() => {
            const fields = ['cardNumber', 'cardExpiry', 'cardCvc'] as stripe.elements.elementsType[];
            this.stripe = Stripe(this.settings.get('billing.stripe_public_key'));
            const elements = this.stripe.elements();

            fields.forEach(field => {
                let el = elements.create(field, {classes: {base: 'base'}});
                el.mount('#'+field);
                el.on('change', this.onChange.bind(this));
                this.stripeElements.push(el);
            });
        });
    }

    /**
     * Destroy all stripe elements instances.
     */
    private destroyStripe() {
        this.stripeElements.forEach(el => {
            el.unmount();
            el.destroy();
        });
    }

    /**
     * Fired on stripe element "change" event.
     */
    private onChange(change: stripe.elements.ElementChangeResponse) {
        this.zone.run(() => {
            this.error = change.error ? change.error.message : null;
        });
    }

    /**
     * Reset credit card form.
     */
    private resetForm() {
        this.error = null;
    }
}
