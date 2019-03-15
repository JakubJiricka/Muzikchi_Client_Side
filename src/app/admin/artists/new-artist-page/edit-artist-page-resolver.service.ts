import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Artists} from "../../../web-player/artists/artists.service";
import {AppAdminModule} from "../../app-admin.module";
import {Artist} from "../../../models/Artist";

@Injectable({
    providedIn: AppAdminModule,
})
export class EditArtistPageResolver implements Resolve<Artist> {

    constructor(
        private artists: Artists,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Artist> {
        const params = {simplified: true},
            id = +route.paramMap.get('id');

        return this.artists.get(id, params).toPromise().then((artist: any) => {
            if (artist) {
                return artist;
            } else {
                this.router.navigate(['/admin/artists']);
                return false;
            }
        }).catch(() => {
            this.router.navigate(['/admin/artists']);
        }) as any;
    }
}