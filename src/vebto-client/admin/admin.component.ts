import {Component, ViewEncapsulation} from "@angular/core";
import {CurrentUser} from "vebto-client/auth/current-user";
import {Settings} from "../core/config/settings.service";

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AdminComponent {

    /**
     * Controls left column visibility.
     */
    public leftColumnIsHidden = false;

    constructor(
        public settings: Settings,
        public currentUser: CurrentUser,
    ) {
    }

    public toggleLeftSidebar() {
        this.leftColumnIsHidden = !this.leftColumnIsHidden;
    }

    public getCustomSidebarItems() {
        return this.settings.get('vebto.admin.pages');
    }
}
