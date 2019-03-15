import {Component, ViewEncapsulation} from "@angular/core";
import {AuthService} from "../auth.service";
import {SocialAuthService} from "../social-auth.service";
import {CurrentUser} from "../current-user";
import {Router} from "@angular/router";
import {Settings} from "../../core/config/settings.service";
import {Toast} from "../../core/ui/toast.service";
import {WebPlayerState} from "../../../app/web-player/web-player-state.service";

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent {

    /**
     * Register credentials model.
     */
    public model: {
        email?: string,
        password?: string,
        password_confirmation?: string,
        purchase_code?: string
    } = {};

    /**
     * Errors returned from backend.
     */
    public errors: {email?: string, password?: string, general?: string} = {};

    /**
     * Whether backend request is in progress currently.
     */
    public isLoading = false;

    /**
     * RegisterComponent Constructor.
     */
    constructor(
        public state: WebPlayerState,
        public auth: AuthService,
        public socialAuth: SocialAuthService,
        public settings: Settings,
        private user: CurrentUser,
        private router: Router,
        private toast: Toast,
    ) {}

    /**
     * Register user and redirect to default authenticated user page.
     */
    public register() {
        this.isLoading = true;

        this.auth.register(this.model).subscribe(response => {
            this.isLoading = false;

            if (this.settings.get('require_email_confirmation')) {
                this.toast.open('We have sent you an email with instructions on how to activate your account.');
            } else {
                this.user.assignCurrent(response.data);
                this.router.navigate([this.auth.getRedirectUri()]).then(() => {
                    this.toast.open('Registered successfully.');
                });
            }
        }, response => {
            this.errors = response['messages'];
            this.isLoading = false;
        });
    }
}
