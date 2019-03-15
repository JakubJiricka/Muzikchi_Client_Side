import {Plan} from "./Plan";
import {User} from "./User";

export class Subscription {
    id: number;
    plan_id: number;
    user_id: number;
    on_grace_period?: boolean;
    gateway: string;
    gateway_id: string;
    valid?: boolean;
    on_trial?: boolean;
    plan?: Plan;
    trial_ends_at: string;
    ends_at: string;
    description: string;
    renews_at: string;
    user?: User;

    constructor(params: Object = {}) {
        for (let name in params) {
            this[name] = params[name];
        }
    }
}