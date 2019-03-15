import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router, CanActivate} from '@angular/router';
import {CurrentUser} from "vebto-client/auth/current-user";
import {AuthService} from "../auth/auth.service";
import {CoreModule} from '../core/core.module';

@Injectable({
    providedIn: CoreModule,
})
export class CheckPermissionsGuard implements CanActivate, CanActivateChild {

    constructor(private currentUser: CurrentUser, private router: Router, private auth: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.hasPermission(route, state);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.hasPermission(route, state);
    }

    private hasPermission(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let hasPermission = true;

        if (route.data.permissions) {
            hasPermission = this.currentUser.hasPermissions(route.data.permissions);
        }

        //user can access this route, bail
        if (hasPermission) return true;

        //redirect to login page, if user is not logged in
        if ( ! this.currentUser.isLoggedIn()) {
            this.currentUser.redirectUri = state.url;
            this.router.navigate(['login']);
        } else {
            this.router.navigate([this.auth.getRedirectUri()]);
        }

        return hasPermission;
    }
}