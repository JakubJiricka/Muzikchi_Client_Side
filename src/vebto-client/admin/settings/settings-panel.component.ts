import {Component, ViewEncapsulation} from "@angular/core";
import {SettingsState} from "./settings-state.service";
import {ActivatedRoute} from "@angular/router";
import {finalize} from "rxjs/operators";
import {Settings} from "../../core/config/settings.service";
import {Toast} from "../../core/ui/toast.service";
import {AppHttpClient} from "vebto-client/core/http/app-http-client.service";
import {Modal} from "../../core/ui/modal.service";
import {Pages} from '../../core/pages/pages.service';
import {CustomHomepage} from '../../core/pages/custom-homepage.service';

@Component({
    selector: 'settings-panel',
    template: '',
    encapsulation: ViewEncapsulation.None,
})
export class SettingsPanelComponent {

    public loading = false;

    constructor(
        public settings: Settings,
        protected toast: Toast,
        protected http: AppHttpClient,
        protected modal: Modal,
        protected route: ActivatedRoute,
        protected pages: Pages,
        protected customHomepage: CustomHomepage,
        public state: SettingsState,
    ) {}

    /**
     * Save current settings to the server.
     */
    public saveSettings(settings?: object) {
        this.loading = true;

        this.settings.save(settings || this.state.getModified())
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.toast.open('Saved settings');
            });
    }
}
