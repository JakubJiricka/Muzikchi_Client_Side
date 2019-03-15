import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDatepicker, MatDialogRef} from "@angular/material";
import * as moment from 'moment';
import {FormControl} from "@angular/forms";
import {debounceTime, switchMap} from "rxjs/operators";
import {Observable, Subject, of as observableOf} from "rxjs";
import {Subscription} from "../../../../core/types/models/Subscription";
import {User} from "../../../../core/types/models/User";
import {Plan} from "../../../../billing/plans/plan";
import {Subscriptions} from "../../../../billing/subscriptions/subscriptions.service";
import {Toast} from "../../../../core/ui/toast.service";
import {Users} from "../../../../auth/users.service";
import {Plans} from "../../../../billing/plans/plans.service";

export interface CrupdateSubscriptionModalData {
    subscription?: Subscription
}

@Component({
    selector: 'crupdate-subscription-modal',
    templateUrl: './crupdate-subscription-modal.component.html',
    styleUrls: ['./crupdate-subscription-modal.component.scss'],
    providers: [Subscriptions, Plans],
    encapsulation: ViewEncapsulation.None
})
export class CrupdateSubscriptionModalComponent implements OnInit {

    /**
     * Whether subscription is currently being saved.
     */
    public loading: boolean = false;

    /**
     * Subscription model.
     */
    public model: Subscription;

    /**
     * If we are updating existing subscription or creating a new one.
     */
    public updating: boolean = false;

    /**
     * Errors returned from backend.
     */
    public errors: any = {};

    /**
     * Form control for user autocomplete input.
     */
    public userAutocomplete: FormControl = new FormControl(null);

    /**
     * Users returned from autocomplete query.
     */
    public filteredUsers: Observable<User[]> = new Subject();

    /**
     * All existing billing plans.
     */
    public plans: Plan[] = [];

    /**
     * CrupdateUserModalComponent Constructor.
     */
    constructor(
        private dialogRef: MatDialogRef<CrupdateSubscriptionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateSubscriptionModalData,
        public subscriptions: Subscriptions,
        private toast: Toast,
        private users: Users,
        private plansApi: Plans,
    ) {
        this.resetState();
    }

    ngOnInit() {
        this.resetState();
        this.bindToUserAutocomplete();
        this.fetchPlans();

        if (this.data.subscription) {
            this.updating = true;
            this.hydrateModel(this.data.subscription);
        } else {
            this.updating = false;
        }
    }

    /**
     * Create a new subscription or update existing one.
     */
    public confirm() {
        this.loading = true;
        let request;

        if (this.updating) {
            request = this.subscriptions.update(this.data.subscription.id, this.getPayload());
        } else {
            request = this.subscriptions.create(this.getPayload());
        }

        request.subscribe(response => {
            this.close(response.subscription);
            let action = this.updating ? 'updated' : 'created';
            this.toast.open('Subscription has been '+action);
            this.loading = false;
        }, response => {
            this.errors = response.messages;
            this.loading = false;
        });
    }

    /**
     * Close the modal.
     */
    public close(data?: any) {
        this.resetState();
        this.dialogRef.close(data);
    }

    public displayFn(user?: User): string {
        return user ? user.email : null;
    }

    /**
     * Populate subscription model with given data.
     */
    private hydrateModel(subscription: Subscription) {
        this.model = Object.assign({}, subscription);

        if (subscription.user_id) {
            this.userAutocomplete.setValue(subscription.user);
        }
    }

    /**
     * Get request payload for backend.
     */
    private getPayload() {
        let payload = {
            renews_at: this.momentToMysql(this.model.renews_at as any),
            ends_at: this.momentToMysql(this.model.ends_at as any),
            plan_id: this.model.plan_id,
            description: this.model.description,
        };

        //if we are creating a new subscription, add user ID to payload
        if ( ! this.updating && this.userAutocomplete.value) {
            payload['user_id'] = this.userAutocomplete.value.id;
        }

        return payload;
    }

    /**
     * Format moment instance into mysql timestamp format.
     */
    private momentToMysql(date: moment.Moment|string) {
        if ( ! date || typeof date === 'string') return date;
        return (date as moment.Moment).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * Reset all modal state to default.
     */
    private resetState() {
        this.model = new Subscription();
        this.errors = {};
    }

    /**
     * Toggle specified date picker's state between open and closed.
     */
    public toggleDatePicker(datePicker: MatDatepicker<Date>) {
        if (datePicker.opened) {
            datePicker.close();
        } else {
            datePicker.open();
        }
    }

    /**
     * Suggest matching users when autocomplete form control's value changes.
     */
    private bindToUserAutocomplete() {
        this.filteredUsers = this.userAutocomplete.valueChanges.pipe(
            debounceTime(400),
            switchMap(query => {
                if ( ! query) return observableOf([]);
                return this.users.getAll({query});
            })
        );
    }

    /**
     * Fetch all existing billing plans.
     */
    private fetchPlans() {
        this.plansApi.all().subscribe(response => {
           this.plans = response.data;

           //select first plan, if none is selected yet
           if ( ! this.model.plan_id) {
               this.model.plan_id = this.plans[0].id;
           }
        });
    }
}
