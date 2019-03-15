import {NgModule} from '@angular/core';
import {AssignUsersToGroupModalComponent} from "./groups/assign-users-to-group-modal/assign-users-to-group-modal.component";
import {CrupdateGroupModalComponent} from "./groups/crupdate-group-modal/crupdate-group-modal.component";
import {UsersComponent} from "./users/users.component";
import {AdminComponent} from "./admin.component";
import {CrupdateUserModalComponent} from "./users/crupdate-user-modal/crupdate-user-modal.component";
import {GroupsComponent} from "./groups/groups.component";
import {PagesComponent} from './pages/pages.component';
import {CrupdatePageComponent} from './pages/crupdate-page/crupdate-page.component';
import {TranslationsComponent} from './translations/translations.component';
import {CrupdateLocalizationModalComponent} from "./translations/crupdate-localization-modal/crupdate-localization-modal.component";
import { MailTemplatesComponent } from './mail-templates/mail-templates.component';
import { MailTemplatePreviewComponent } from './mail-templates/mail-template-preview/mail-template-preview.component';
import {UserAccessManagerComponent} from "./users/user-access-manager/user-access-manager.component";
import {SelectGroupsModalComponent} from "./users/select-groups-modal/select-groups-modal.component";
import {AppearanceModule} from "./appearance/appearance.module";
import { AdsPageComponent } from './ads-page/ads-page.component';
import {SettingsModule} from "./settings/settings.module";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UiModule} from "../core/ui/ui.module";
import {AuthModule} from "../auth/auth.module";
import {TextEditorModule} from "../text-editor/text-editor.module";
import {
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MAT_DATE_FORMATS,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatSidenavModule,
} from "@angular/material";
import {MomentDateModule} from "@angular/material-moment-adapter";
import {SelectPermissionsModalComponent} from "./permissions/select-permissions-modal/select-permissions-modal.component";
import {PermissionsManagerPanelComponent} from "./permissions/permissions-manager-panel/permissions-manager-panel.component";
import {CrupdatePlanModalComponent} from './billing/plans/crupdate-plan-modal/crupdate-plan-modal.component';
import {CrupdateSubscriptionModalComponent} from './billing/subscriptions/crupdate-subscription-modal/crupdate-subscription-modal.component';
import {SubscriptionsListComponent} from './billing/subscriptions/subscriptions-list/subscriptions-list.component';
import {PlansListComponent} from './billing/plans/plans-list/plans-list.component';
import {ReorderPlanFeaturesDirective} from './billing/plans/crupdate-plan-modal/reorder-plan-features.directive';
import {FullPlanNameModule} from '../billing/plans/full-plan-name/full-plan-name.module';
import { DataTableComponent } from './data-table/data-table.component';
import {AnalyticsComponent} from './analytics/analytics.component';

export const MY_FORMATS = {
    display: {
        dateInput: 'YYYY-MM-DD',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextEditorModule,
        AppearanceModule,
        SettingsModule,
        UiModule,
        AuthModule,
        FullPlanNameModule,

        //material
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatListModule,
        MatExpansionModule,
        MatChipsModule,
        MatDatepickerModule,
        MomentDateModule,
        MatAutocompleteModule,
        MatSidenavModule,
    ],
    declarations: [
        AdminComponent,
        GroupsComponent,
        CrupdateGroupModalComponent,
        AssignUsersToGroupModalComponent,
        UsersComponent,
        CrupdateUserModalComponent,
        TranslationsComponent,
        CrupdateLocalizationModalComponent,
        PagesComponent,
        CrupdatePageComponent,
        MailTemplatesComponent,
        MailTemplatePreviewComponent,
        UserAccessManagerComponent,
        SelectGroupsModalComponent,
        SelectPermissionsModalComponent,
        PermissionsManagerPanelComponent,
        AdsPageComponent,
        AnalyticsComponent,

        //billing
        PlansListComponent,
        SubscriptionsListComponent,
        CrupdatePlanModalComponent,
        ReorderPlanFeaturesDirective,
        CrupdateSubscriptionModalComponent,
        DataTableComponent,
    ],
    entryComponents: [
        CrupdateUserModalComponent,
        CrupdateGroupModalComponent,
        AssignUsersToGroupModalComponent,
        CrupdateLocalizationModalComponent,
        SelectGroupsModalComponent,
        SelectPermissionsModalComponent,
        PermissionsManagerPanelComponent,

        //billing
        CrupdatePlanModalComponent,
        CrupdateSubscriptionModalComponent,
    ],
    exports:      [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextEditorModule,
        AppearanceModule,
        SettingsModule,
        UiModule,
        AuthModule,
        PermissionsManagerPanelComponent,
        SelectPermissionsModalComponent,
        DataTableComponent,

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
        MatChipsModule,
    ],
    providers: [
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ]
})
export class AdminModule { }