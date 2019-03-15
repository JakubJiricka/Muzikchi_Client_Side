import {NgModule} from '@angular/core';
import {AuthRoutingModule} from "./auth.routing";
import {MenubarComponent} from "./menubar/menubar.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {RequestExtraCredentialsModalComponent} from "./request-extra-credentials-modal/request-extra-credentials-modal.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {UiModule} from "../core/ui/ui.module";

@NgModule({
    imports: [
        AuthRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiModule,
        RouterModule,
    ],
    exports: [
        RouterModule,
    ],
    declarations: [
        MenubarComponent,
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        RequestExtraCredentialsModalComponent,
    ],
    entryComponents: [
        RequestExtraCredentialsModalComponent,
    ]
})
export class AuthModule {
}
