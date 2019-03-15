import {Injectable} from '@angular/core';
import {HttpCacheClient} from "../../core/http/http-cache-client";
import {Observable} from 'rxjs';
import {Group} from '../../core/types/models/Group';
import {AdminModule} from '../admin.module';

@Injectable({
    providedIn: AdminModule,
})
export class GroupService {

    constructor(private httpClient: HttpCacheClient) {}

    /**
     * Fetch all existing user groups.
     */
    public getGroups(): Observable<{data: Group[]}> {
        return this.httpClient.getWithCache('groups?per_page=15');
    }

    /**
     * Create a new group.
     */
    public createNew(data): Observable<Group> {
        return this.httpClient.post('groups', data);
    }

    /**
     * Update existing group.
     */
    public update(groupId, data): Observable<Group> {
        return this.httpClient.put('groups/'+groupId, data);
    }

    /**
     * Delete group with given id.
     */
    public delete(groupId: number): Observable<any> {
        return this.httpClient.delete('groups/'+groupId);
    }

    /**
     * Add users to given group.
     */
    public addUsers(groupId: number, emails: string[]): Observable<Group> {
        return this.httpClient.post('groups/'+groupId+'/add-users', {emails});
    }

    /**
     * Remove users from given group.
     */
    public removeUsers(groupId: number, userIds: number[]): Observable<Group> {
        return this.httpClient.post('groups/'+groupId+'/remove-users', {ids: userIds});
    }
}