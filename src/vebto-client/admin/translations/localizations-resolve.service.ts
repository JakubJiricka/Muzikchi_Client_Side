import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {Localization} from "../../core/types/models/Localization";
import {Localizations} from '../../core/translations/localizations.service';
import {AdminModule} from '../admin.module';

@Injectable({
    providedIn: AdminModule,
})
export class LocalizationsResolve implements Resolve<Localization[]> {

    constructor(private localizations: Localizations, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Promise<Localization[]> {
        return this.localizations.all().toPromise().then(response => {
            return response.localizations;
        }, () => {
            this.router.navigate(['/admin']);
            return false;
        }) as any;
    }
}