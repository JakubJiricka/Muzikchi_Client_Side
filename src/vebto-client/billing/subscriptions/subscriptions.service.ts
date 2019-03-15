import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Subscription} from "./subscription";
import {Plan} from "../plans/plan";
import {AppHttpClient} from '../../core/http/app-http-client.service';
import {PaginationResponse} from '../../core/types/pagination-response';
import {User} from '../../core/types/models/User';

@Injectable()
export class Subscriptions {

    /**
     * Subscriptions constructor.
     */
    constructor(private http: AppHttpClient) {}

    /**
     * Get all available subscriptions.
     */
    public all(params?: object): Observable<PaginationResponse<Subscription>> {
        return this.http.get('billing/subscriptions', params);
    }

    /**
     * Get subscription matching specified id.
     */
    public get(id: number): Observable<{subscription: Subscription}> {
        return this.http.get('billing/subscriptions/'+id);
    }

    /**
     * Create a new subscription on stripe.
     */
    public createOnStripe(params: {plan_id: number, start_date?: string}): Observable<{user: User}> {
        return this.http.post('billing/subscriptions/stripe', params);
    }

    /**
     * Update subscription matching specified id.
     */
    public update(id: number, params: object): Observable<{subscription: Subscription}> {
        return this.http.put('billing/subscriptions/'+id, params);
    }

    /**
     * Create a new subscription.
     */
    public create(params: object): Observable<{subscription: Subscription}> {
        return this.http.post('billing/subscriptions', params);
    }

    /**
     * Cancel subscription matching specified id.
     */
    public cancel(id: number, params: {delete: boolean}): Observable<{user: User}> {
        return this.http.delete('billing/subscriptions/'+id, params);
    }

    public resume(id: number): Observable<{subscription: Subscription}> {
        return this.http.post('billing/subscriptions/'+id+'/resume');
    }

    public changePlan(id: number, plan: Plan): Observable<{user: User}|{links: {approve: string}}> {
        return this.http.post('billing/subscriptions/'+id+'/change-plan', {newPlanId: plan.id});
    }

    public addCard(token: string): Observable<{user: User}> {
        return this.http.post('billing/stripe/cards/add', {token});
    }
}
