import {Component, ViewEncapsulation} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {Settings} from "../../core/config/settings.service";
import {Toast} from "../../core/ui/toast.service";

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    providers: [AuthService],
    encapsulation: ViewEncapsulation.None,
})

export class ForgotPasswordComponent {

    /**
     * ForgotPassword credentials model.
     */
    public model: {email?: string} = {};

    /**
     * Errors returned from backend.
     */
    public errors: {email?: string, general?: string} = {};

    /**
     * Whether backend request is in progress currently.
     */
    public isLoading = false;

    /**
     * ForgotPasswordComponent Constructor.
     */
    constructor(
        public auth: AuthService,
        public settings: Settings,
        private toast: Toast,
        private router: Router,
    ) {}

    /**
     * Log user in and redirect to default auth user page.
     */
    public sendPasswordResetLink() {
        this.isLoading = true;

        this.auth.sendPasswordResetLink(this.model).subscribe(response => {
            this.toast.open(response.data);
            this.router.navigate(['/login']);
        }, response => {
            this.errors = response['messages'];
            this.isLoading = false;
        });
    }
}
