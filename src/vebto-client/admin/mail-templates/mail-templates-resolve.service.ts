import { Injectable }             from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {MailTemplate} from "../../core/types/models/MailTemplate";
import {AppHttpClient} from "vebto-client/core/http/app-http-client.service";
import {AdminModule} from '../admin.module';

@Injectable({
    providedIn: AdminModule,
})
export class MailTemplatesResolve implements Resolve<{model: MailTemplate, html: string, plain?: string}> {

    constructor(private http: AppHttpClient, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Promise<{model: MailTemplate, html: string, plain?: string}> {
        return this.http.get('mail-templates').toPromise().then(response => {
            return response;
        }, () => {
            this.router.navigate(['/admin']);
            return false;
        }) as any;
    }
}