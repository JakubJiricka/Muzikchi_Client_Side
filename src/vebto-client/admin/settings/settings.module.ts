import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from "./settings.component";
import {SettingsPanelComponent} from "./settings-panel.component";
import {AuthenticationSettingsComponent} from "./authentication/authentication-settings.component";
import {CacheSettingsComponent} from "./cache/cache-settings.component";
import {PermissionsSettingsComponent} from "./permissions/permissions-settings.component";
import {AnalyticsSettingsComponent} from "./analytics/analytics-settings.component";
import {LocalizationSettingsComponent} from "./localization/localization-settings.component";
import {MailSettingsComponent} from "./mail/mail-settings.component";
import {LoggingSettingsComponent} from "./logging/logging-settings.component";
import {QueueSettingsComponent} from "./queue/queue-settings.component";
import {SettingsResolve} from "./settings-resolve.service";
import {SettingsState} from "./settings-state.service";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HomepageSettingsComponent} from "./homepage/homepage-settings.component";
import {
    MatAutocompleteModule,
    MatButtonModule, MatCheckboxModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatMenuModule, MatPaginatorModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule,
    MatTooltipModule, MatChipsModule
} from "@angular/material";
import {UiModule} from "../../core/ui/ui.module";
import {BillingSettingsComponent} from './billing/billing-settings.component';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiModule,

        //material
        MatButtonModule,
        MatSnackBarModule,
        MatTableModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatSortModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatInputModule,
        MatChipsModule,
    ],
    declarations: [
        SettingsComponent,
        SettingsPanelComponent,
        AuthenticationSettingsComponent,
        CacheSettingsComponent,
        PermissionsSettingsComponent,
        AnalyticsSettingsComponent,
        LocalizationSettingsComponent,
        MailSettingsComponent,
        LoggingSettingsComponent,
        QueueSettingsComponent,
        HomepageSettingsComponent,
        BillingSettingsComponent,
    ],
    providers: [
        SettingsResolve,
        SettingsState,
    ]
})
export class SettingsModule {
}
