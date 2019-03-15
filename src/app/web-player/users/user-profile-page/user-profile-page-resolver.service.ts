import {Injectable} from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {WebPlayerState} from "../../web-player-state.service";
import {User} from "vebto-client/core/types/models/User";
import {Users} from "vebto-client/auth/users.service";

@Injectable()
export class UserProfilePageResolver implements Resolve<User> {

    constructor(
        private users: Users,
        private router: Router,
        private state: WebPlayerState
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<User> {
        this.state.loading = true;

        const id = +route.paramMap.get('id');

        return this.users.get(id, {with: 'playlists,followers,followedUsers'}).toPromise().then(response => {
            this.state.loading = false;

            if (response && response.user) {
                return response.user;
            } else {
                this.router.navigate(['/']);
                return null;
            }
        }).catch(() => {
            this.state.loading = false;
            this.router.navigate(['/']);
        }) as any;
    }
}