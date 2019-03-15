import * as Raven from 'raven-js';
import {CurrentUser} from "vebto-client/auth/current-user";
import {Settings} from "../config/settings.service";
import {NoBackendErrorHandler} from './no-backend-error-handler';

export function ravenErrorHandlerFactory (settings: Settings, currentUser: CurrentUser) {
    return new RavenErrorHandler(settings, currentUser);
}

export class RavenErrorHandler extends NoBackendErrorHandler {
    
    /**
     * Http error codes that should not be reported.
     */
    protected dontReport = [
        401, 402, 403, 422
    ];
    
    /**
     * RavenErrorHandler Constructor.
     */
    constructor(
        protected settings: Settings,
        protected currentUser: CurrentUser
    ) {
        super(settings);
        this.setUserContext();
    }

    /**
     * Handle specified error.
     */
    public handleError(err: any): void {
        //if there's no error, or it's a validation error, bail
        if ( ! err || (err.type === 'http' && this.dontReport.indexOf(err.status) > -1)) return;

        super.handleError(err, {
            extra: {user: this.currentUser.getModel()},
        });
    }

    private setUserContext() {
        if (this.currentUser.isLoggedIn()) {
            Raven.setUserContext({
                id: this.currentUser.get('id'),
                username: this.currentUser.get('display_name'),
                email: this.currentUser.get('email')
            });
        }
    }
}