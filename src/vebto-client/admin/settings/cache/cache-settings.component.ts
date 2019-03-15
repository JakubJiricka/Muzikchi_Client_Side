import {Component, ViewEncapsulation} from "@angular/core";
import {SettingsPanelComponent} from "../settings-panel.component";
import {finalize} from "rxjs/operators";

@Component({
    selector: 'cache-settings',
    templateUrl: './cache-settings.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CacheSettingsComponent extends SettingsPanelComponent {

    /**
     * Clear website cache.
     */
    public clearCache() {
        this.loading = true;

        this.http.post('cache/clear').pipe(finalize(() => {
            this.loading = false;
        })).subscribe(() => {
            this.toast.open('Cache cleared.');
        });
    }
}
