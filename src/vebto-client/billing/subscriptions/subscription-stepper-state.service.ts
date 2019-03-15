import {Injectable} from "@angular/core";
import {Plan} from "../plans/plan";

@Injectable()
export class SubscriptionStepperState {

    /**
     * All available plans.
     */
    public plans: Plan[] = [];

    /**
     * Model for plan period radio group.
     */
    public radioGroupModel: number;

    /**
     * Base plan, selected in the first step.
     */
    public initialPlan: Plan;

    /**
     * Final billing plan user has selected (base or yearly alternative)
     */
    public selectedPlan: Plan;

    /**
     * Select initial "base" plan.
     */
    public selectInitialPlan(plan: Plan) {
        this.initialPlan = plan;
        this.selectedPlan = plan;

        const children = this.getChildPlans(plan);

        if (children && children[0]) {
            this.radioGroupModel = children[0].id;
            this.selectedPlan = children[0]
        } else {
            this.selectedPlan = plan;
        }
    }

    /**
     * Select plan by specified ID.
     */
    public selectPlanById(id: number) {
        this.selectedPlan = this.plans.find(plan => plan.id === id);
    }

    /**
     * Get different versions of specified plan.
     * (yearly, weekly, every 2 years etc)
     */
    public getChildPlans(parent: Plan) {
        return this.plans.filter(plan => plan.parent_id === parent.id);
    }

    /**
     * Set all available plans.
     */
    public setPlans(plans: Plan[]) {
        this.plans = plans;
    }
}