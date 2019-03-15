import {Route, RouterModule} from "@angular/router";
import {UpgradePageComponent} from "./upgrade-page/upgrade-page.component";
import {NgModule} from "@angular/core";
import {BillingPlansResolver} from "./upgrade-page/billing-plans-resolver.service";
import {UserSubscriptionPageComponent} from "./subscriptions/user-subscription-page/user-subscription-page.component";
import {CurrenciesListResolver} from "./upgrade-page/currencies-list-resolver.service";
import {UserNotSubscribedGuard} from "./guards/user-not-subscribed-guard.service";
import {BillingEnabledGuard} from "./guards/billing-enabled-guard.service";
import {UserSubscribedGuard} from "./guards/user-subscribed-guard.service";
import {AuthGuard} from '../guards/auth-guard.service';

export const routes: Route[] = [
    {
        path: 'upgrade',
        component: UpgradePageComponent,
        canActivate: [BillingEnabledGuard, AuthGuard, UserNotSubscribedGuard],
        resolve: {
            plans: BillingPlansResolver,
            currencies: CurrenciesListResolver
        }
    },
    {
        path: 'subscription',
        component: UserSubscriptionPageComponent,
        resolve: {plans: BillingPlansResolver},
        canActivate: [BillingEnabledGuard, AuthGuard, UserSubscribedGuard],
        data: {name: 'account-settings-subscription'},
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingRoutingModule {}