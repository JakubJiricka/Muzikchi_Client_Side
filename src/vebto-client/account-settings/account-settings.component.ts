import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Users} from "../auth/users.service";
import {CurrentUser} from "vebto-client/auth/current-user";
import {AuthService} from "../auth/auth.service";
import {Toast} from "../core/ui/toast.service";
import {Uploads} from "../core/files/uploads.service";
import {ErrorsModel, PasswordModel} from "./account-settings-types";
import {Settings} from "../core/config/settings.service";
import {User} from "../core/types/models/User";
import {Translations} from '../core/translations/translations.service';
import {Localizations} from '../core/translations/localizations.service';

@Component({
    selector: 'account-settings',
    templateUrl: './account-settings.component.html',
    styleUrls: ['./account-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AccountSettingsComponent implements OnInit {

    /**
     * User model.
     */
    public user = new User();

    /**
     * Value lists for selects in the view.
     */
    public selects = {
        timezones: [],
        countries: [],
        languages: [],
    };

    /**
     * Model for user password change.
     */
    public password: PasswordModel = {};

    /**
     * Errors returned from backend.
     */
    public errors: ErrorsModel = {password: {}, account: {}};

    /**
     * AccountSettingsComponent Constructor.
     */
    constructor(
        public settings: Settings,
        private route: ActivatedRoute,
        private users: Users,
        private currentUser: CurrentUser,
        private toast: Toast,
        private uploads: Uploads,
        private i18n: Translations,
        private localizations: Localizations,
        public auth: AuthService,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.user = data['resolves']['user'];
            this.selects.timezones = data['resolves']['selects']['timezones'];
            this.selects.countries = data['resolves']['selects']['countries'];
            this.selects.languages = data['resolves']['selects']['languages'];
        });
    }

    /**
     * Update user account settings.
     */
    public updateAccountSettings() {
        this.users.update(this.user.id, this.getAccountSettingsPayload()).subscribe(() => {
            this.toast.open('Account settings updated');
            this.errors.account = {};
        }, response => this.errors.account = response.messages);
    }

    /**
     * Open file upload dialog and upload selected file as user avatar.
     */
    public openAvatarUploadDialog() {
        this.uploads.openUploadDialog().then(files => {
            if (this.uploads.filesAreInvalid(files, true)) return;

            this.users.uploadAvatar(this.user.id, files).subscribe(user => {
                this.user.avatar = user.avatar;
                this.currentUser.set('avatar', user.avatar);
                this.toast.open('Avatar updated');
            }, response => {
                const key = Object.keys(response.messages)[0];
                this.toast.open(response.messages[key]);
            });
        });
    }

    /**
     * Delete user avatar.
     */
    public deleteAvatar() {
        this.users.deleteAvatar(this.user.id).subscribe(user => {
            this.user.avatar = user.avatar;
            this.currentUser.set('avatar', user.avatar);
            this.toast.open('Avatar removed');
        });
    }

    /**
     * Change user password.
     */
    public changeUserPassword() {
        this.users.changePassword(this.user.id, this.password)
        .subscribe(() => {
            this.toast.open('Password updated');
            this.errors.password = {};
            this.password = {};
            this.user.has_password = true;
        }, response => this.errors.password = response.messages);
    }

    /**
     * Change currently active language.
     */
    public changeLanguage(name: string) {
        this.localizations.get(name).subscribe(response => {
            this.i18n.setLocalization(response.localization);
        });
    }

    /**
     * Return payload to send to backend when updating account settings.
     */
    private getAccountSettingsPayload() {
        return {
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            language: this.user.language,
            timezone: this.user.timezone,
            country: this.user.country,
            avatar: this.user.avatar,
        };
    }
}
