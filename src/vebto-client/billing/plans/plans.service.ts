import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Plan} from "./plan";
import {AppHttpClient} from '../../core/http/app-http-client.service';
import {PaginationResponse} from '../../core/types/pagination-response';

@Injectable()
export class Plans {

    /**
     * Plans API service constructor.
     */
    constructor(private http: AppHttpClient) {}

    /**
     * Get all available projects.
     */
    public all(params?: object): Observable<PaginationResponse<Plan>> {
        return this.http.get('billing/plans', params);
    }

    /**
     * Get plan matching specified id.
     */
    public get(id: number): Observable<{plan: Plan}> {
        return this.http.get('billing/plans/'+id);
    }

    /**
     * Create a new plan.
     */
    public create(params: object): Observable<{plan: Plan}> {
        return this.http.post('billing/plans', params);
    }

    /**
     * Sync billing plans across all gateways.
     */
    public sync(): Observable<object> {
        return this.http.post('billing/plans/sync');
    }

    /**
     * Update plan matching specified id.
     */
    public update(id: number, params: object): Observable<{plan: Plan}> {
        return this.http.put('billing/plans/'+id, params);
    }

    /**
     * Delete plan matching specified id.
     */
    public delete(params: {ids: number[]}): Observable<any> {
        return this.http.delete('billing/plans', params);
    }
}
