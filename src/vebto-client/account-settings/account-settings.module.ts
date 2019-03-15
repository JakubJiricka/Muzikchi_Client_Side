import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ConnectSocialAccountsPanelComponent} from "./connect-social-accounts-panel/connect-social-accounts-panel.component";
import {AccountSettingsResolve} from "./account-settings-resolve.service";
import {UiModule} from "../core/ui/ui.module";
import {AccountSettingsRoutingModule} from "./account-settings-routing.module";
import {AccountSettingsComponent} from "./account-settings.component";

@NgModule({
    imports:      [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiModule,
        AccountSettingsRoutingModule,
    ],
    declarations: [
        AccountSettingsComponent,
        ConnectSocialAccountsPanelComponent,
    ],
    entryComponents: [
        ConnectSocialAccountsPanelComponent,
    ],
    exports:      [
        AccountSettingsRoutingModule,
    ],
    providers:    [
        AccountSettingsResolve
    ]
})
export class AccountSettingsModule { }