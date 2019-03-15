import {Component, ViewEncapsulation} from "@angular/core";
import {CurrentUser} from "vebto-client/auth/current-user";
import {AuthService} from "../../../auth/auth.service";

@Component({
    selector: 'logged-in-user-widget',
    templateUrl: './logged-in-user-widget.component.html',
    styleUrls: ['./logged-in-user-widget.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoggedInUserWidgetComponent  {

    /**
     * LoggedInUserWidgetComponent Constructor.
     */
    constructor(public currentUser: CurrentUser, public auth: AuthService) {}
}
