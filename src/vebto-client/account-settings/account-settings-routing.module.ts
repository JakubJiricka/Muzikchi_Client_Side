import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {AuthGuard} from "../guards/auth-guard.service";
import {AccountSettingsComponent} from "./account-settings.component";
import {AccountSettingsResolve} from "./account-settings-resolve.service";

const routes: Routes = [
    // {
    //     path: 'account',
    //     pathMatch: 'prefix',
    //     redirectTo: 'account/settings'
    // },
    {
        path: 'account/settings',
        component: AccountSettingsComponent,
        resolve: {resolves: AccountSettingsResolve},
        canActivate: [AuthGuard],
        data: {name: 'account-settings'},
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountSettingsRoutingModule {}