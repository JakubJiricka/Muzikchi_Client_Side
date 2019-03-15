import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AppHttpClient} from "vebto-client/core/http/app-http-client.service";
import {AppearanceModule} from './appearance.module';

@Injectable({
    providedIn: AppearanceModule
})
export class AppearanceEditorResolver implements Resolve<any[]> {

    constructor(private http: AppHttpClient) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any[]> {
        return this.http.get('admin/appearance/values').toPromise() as any;
    }
}

