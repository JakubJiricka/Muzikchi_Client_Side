import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Plan} from "../../../../core/types/models/Plan";
import {Toast} from "../../../../core/ui/toast.service";
import {ValueLists} from "../../../../core/services/value-lists.service";
import {Plans} from "../../../../billing/plans/plans.service";
import {randomString} from "../../../../core/utils/random-string";

export interface CrupdatePlanModalData {
    plan?: Plan,
    plans: Plan[]
}

@Component({
    selector: 'crupdate-plan-modal',
    templateUrl: './crupdate-plan-modal.component.html',
    styleUrls: ['./crupdate-plan-modal.component.scss'],
    providers: [Plans],
    encapsulation: ViewEncapsulation.None
})
export class CrupdatePlanModalComponent implements OnInit {

    /**
     * Whether plan is currently being saved.
     */
    public loading: boolean = false;

    /**
     * Plan model.
     */
    public model: Plan;

    /**
     * If we are updating existing plan or creating a new one.
     */
    public updating: boolean = false;

    /**
     * New feature input model.
     */
    public newFeature: string;

    /**
     * Plan features model.
     */
    public features: {content: string, id: string}[] = [];

    /**
     * Errors returned from backend.
     */
    public errors: any = {};

    public currencies: {name: string, decimal_digits: number, symbol: string, code: string}[] = [];

    public intervals = ['day', 'week', 'month', 'year'];

    /**
     * All existing plans.
     */
    public allPlans: Plan[];

    /**
     * CrupdateUserModalComponent Constructor.
     */
    constructor(
        private dialogRef: MatDialogRef<CrupdatePlanModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdatePlanModalData,
        public plans: Plans,
        private toast: Toast,
        private valueLists: ValueLists,
    ) {
        this.resetState();
    }

    ngOnInit() {
        this.resetState();
        this.allPlans = this.data.plans;

        this.valueLists.get('currencies').subscribe(response => {
            this.currencies = Object.keys(response.currencies).map(key => {
                return response.currencies[key];
            });
        });

        if (this.data.plan) {
            this.updating = true;
            this.hydrateModel(this.data.plan);
        } else {
            this.updating = false;
        }
    }

    /**
     * Create a new plan or update existing one.
     */
    public confirm() {
        this.loading = true;
        let request;

        if (this.updating) {
            request = this.plans.update(this.data.plan.id, this.getPayload());
        } else {
            request = this.plans.create(this.getPayload());
        }

        request.subscribe(response => {
            this.close(response.plan);
            let action = this.updating ? 'updated' : 'created';
            this.toast.open('Plan has been '+action);
            this.loading = false;
        }, response => {
            this.errors = response.messages;
            this.loading = false;
        });
    }

    public getPayload() {
        let payload = Object.assign({}, this.model);
        payload.features = this.features.map(feature => feature.content);

        const currency = this.currencies.find(curr => curr.code === payload.currency);
        payload.currency_symbol = currency.symbol;

        return payload;
    }

    /**
     * Close the modal.
     */
    public close(data?: any) {
        this.resetState();
        this.dialogRef.close(data);
    }

    /**
     * Add new feature to plan.
     */
    public addFeature() {
        const exists = this.features.findIndex(curr => curr.content === this.newFeature) > -1;
        if (exists || ! this.newFeature) return;
        this.features.push({content: this.newFeature, id: randomString(5)});
        this.newFeature = null;
    }

    /**
     * Remove specified feature from plan.
     */
    public removeFeature(feature: {content: string, id: string}) {
        const i = this.features.findIndex(curr => curr.id === feature.id);
        this.features.splice(i, 1);
    }

    /**
     * Get all base plans.
     */
    public getBasePlans(): Plan[] {
        return this.allPlans.filter(plan => !plan.parent_id);
    }

    /**
     * Populate plan model with given data.
     */
    private hydrateModel(plan: Plan) {
        this.model = Object.assign(plan);
        this.features = plan.features.map(feature => {
            return {content: feature, id: randomString(5)};
        });
    }

    /**
     * Reset all modal state to default.
     */
    private resetState() {
        this.model = new Plan({currency: 'USD', interval: 'month', interval_count: 1, position: 1});
        this.features = [];
        this.errors = {};
    }
}
