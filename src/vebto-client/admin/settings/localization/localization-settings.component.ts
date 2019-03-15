import {Component, ViewEncapsulation} from "@angular/core";
import {SettingsPanelComponent} from "../settings-panel.component";
import {LocalizationWithLines} from "../../translations/translations.component";

@Component({
    selector: 'localization-settings',
    templateUrl: './localization-settings.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class LocalizationSettingsComponent extends SettingsPanelComponent {

    /**
     * All available localizations.
     */
    public localizations: LocalizationWithLines[] = [];

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.localizations = data.localizations;
        });
    }

    public getCurrentDate() {
        return new Date();
    }

}
