import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpCacheClient} from "../http/http-cache-client";
import {CoreModule} from '../core.module';

@Injectable({
    providedIn: CoreModule,
})
export class ValueLists {

    /**
     * ValueListsService Constructor.
     */
    constructor(private httpClient: HttpCacheClient) {}

    /**
     * Get value list by name.
     */
    public get(name: string): Observable<{currencies: any}> {
        return this.httpClient.getWithCache('value-lists/'+name);
    }

    /**
     * Fetch all existing app permissions.
     */
    public getPermissions(): Observable<{permissions: object}> {
        return this.httpClient.getWithCache('value-lists/permissions');
    }

    public getValuesForSelects() {
        return this.httpClient.getWithCache('value-lists/selects');
    }
}