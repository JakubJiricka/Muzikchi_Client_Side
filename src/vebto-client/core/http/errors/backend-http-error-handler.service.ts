import {Injectable} from '@angular/core';
import {CurrentUser} from "vebto-client/auth/current-user";
import {Router} from "@angular/router";
import {Toast} from "../../ui/toast.service";
import {Translations} from "../../translations/translations.service";
import {HttpErrorHandler} from './http-error-handler.service';

@Injectable()
export class BackendHttpErrorHandler extends HttpErrorHandler {

    /**
     * HttpErrorHandler Constructor.
     */
    constructor(
        protected i18n: Translations,
        protected currentUser: CurrentUser,
        protected router: Router,
        protected toast: Toast,
    ) {
        super(i18n);
    }

    /**
     * Redirect user to login page or show toast informing
     * user that he does not have required permissions.
     */
    protected handle403Error(response: object) {
        //if user doesn't have access, navigate to login page
        if (this.currentUser.isLoggedIn()) {
            let msg = "You don't have required permissions to do that.";
            this.toast.open(response['message'] ? response['message'] : msg);
        } else {
            this.router.navigate(['/login']);
        }
    }
}
