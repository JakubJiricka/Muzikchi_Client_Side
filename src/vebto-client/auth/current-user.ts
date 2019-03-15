import {Injectable} from '@angular/core';
import {User} from '../core/types/models/User';
import {Group} from '../core/types/models/Group';
import {Subscription} from '../billing/subscriptions/subscription';

@Injectable()
export class CurrentUser {

    /**
     * Current user model.
     */
    private current: User;

    /**
     * Group that should be assigned to guests.
     */
    private guestsGroup: Group;

    /**
     * Merged explicit and inherited from
     * groups permissions for current user.
     */
    private cachedPermissions: { [key: string]: number };

    /**
     * Uri user was attempting to open before
     * redirect to login page, if any.
     */
    public redirectUri?: string;

    /**
     * Get property of currently logged in user model.
     */
    public get(prop: string): any {
        return this.current && this.current[prop];
    }

    /**
     * Get model of currently logged in user.
     */
    public getModel(): User {
        return Object.assign({}, this.current);
    }

    /**
     * Set property of currently logged in user object.
     */
    public set(key: string, value: any): void {
        this.current[key] = value;
    }

    /**
     * Set a new current user.
     */
    public assignCurrent(model?: User) {
        this.clear();

        if (model) {
            this.current = model;
        }
    }

    /**
     * Check if current user has all specified permissions.
     */
    public hasPermissions(permissions: string[]): boolean {
        return permissions.filter(permission => {
            return !this.hasPermission(permission);
        }).length === 0;
    }

    /**
     * Check if user has given permission.
     */
    public hasPermission(permission: string): boolean {
        let permissions = this.getAllPermissions();
        return (permissions['admin'] || permissions[permission]) > 0;
    }

    /**
     * Check if current user is logged in.
     */
    public isLoggedIn(): boolean {
        return this.get('id') > 0;
    }

    /**
     * Check if user subscription is active, on trial, or on grace period.
     */
    public isSubscribed(): boolean {
        if (!this.current.subscriptions) return false;
        return this.current.subscriptions.find(sub => sub.valid) !== undefined;
    }

    /**
     * Check if user subscription is active
     */
    public subscriptionIsActive(): boolean {
        return this.isSubscribed() && !this.onTrial();
    }

    public onTrial() {
        let sub = this.getSubscription();
        return sub && sub.on_trial;
    }

    public onGracePeriod(): boolean {
        let sub = this.getSubscription();
        return sub && sub.on_grace_period;
    }

    public getSubscription(filters: { gateway?: string, planId?: number } = {}): Subscription {
        if (!this.isSubscribed()) return null;

        let subs = this.current.subscriptions.slice();

        if (filters.gateway) {
            subs = subs.filter(sub => sub.gateway === filters.gateway);
        }

        if (filters.planId) {
            subs = subs.filter(sub => sub.plan_id === filters.planId);
        }

        return subs[0];
    }

    /**
     * Set specified subscription on current user model.
     */
    public setSubscription(subscription: Subscription) {
        const i = this.current.subscriptions.findIndex(sub => sub.id === subscription.id);

        if (i > -1) {
            this.current.subscriptions[i] = subscription;
        } else {
            this.current.subscriptions.push(subscription);
        }
    }

    /**
     * Check if current user is an admin.
     */
    public isAdmin(): boolean {
        return this.hasPermission('admin');
    }

    /**
     * Clear current user information.
     */
    public clear() {
        this.current = new User({groups: [this.guestsGroup]});
        this.cachedPermissions = null;
    }

    /**
     * Init CurrentUser service.
     */
    public init(params: { user?: User, guestsGroup: Group }) {
        this.guestsGroup = params.guestsGroup;
        this.assignCurrent(params.user);
    }

    /**
     * Get flattened array of all permissions current user has.
     */
    private getAllPermissions(): { [key: string]: number } {
        if (this.cachedPermissions) {
            return this.cachedPermissions;
        }

        //permissions on user modal
        let permissions = this.get('permissions') || {};

        //merge group permissions
        const groups = this.get('groups') || [];
        groups.forEach((group: Group) => {
            if (group) Object.assign(permissions, group.permissions);
        });

        //merge billing plan permissions
        const subscription = this.getSubscription();
        if (subscription && subscription.plan) {
            Object.assign(permissions, subscription.plan.permissions);
        }

        return this.cachedPermissions = permissions;
    }
}