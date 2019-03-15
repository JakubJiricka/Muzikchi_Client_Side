import {RouterModule, Routes} from '@angular/router';
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {NgModule} from "@angular/core";
import {LoginComponent} from "./login/login.component";
import {GuestGuard} from "../guards/guest-guard.service";
import {RegisterComponent} from "./register/register.component";
import {DisableRouteGuard} from "../guards/disable-route-guard.service";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";

const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [GuestGuard, DisableRouteGuard]},
    {path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [GuestGuard]},
    {path: 'password/reset/:token', component: ResetPasswordComponent, canActivate: [GuestGuard]},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}