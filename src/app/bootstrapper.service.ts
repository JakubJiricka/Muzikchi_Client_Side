import {Injectable} from '@angular/core';
import {UserLibrary} from "./web-player/users/user-library/user-library.service";
import {UserPlaylists} from "./web-player/playlists/user-playlists.service";
import {Bootstrapper} from "vebto-client/core/bootstrapper.service";

@Injectable()
export class BeMusicBootstrapper extends Bootstrapper {

    /**
     * Handle specified bootstrap data.
     */
    protected handleData(encodedData: string) {
        const data = super.handleData(encodedData);

        //set user library
        this.injector.get(UserLibrary).setTrackIds(data['tracks']);

        //set user playlists
        this.injector.get(UserPlaylists).set(data['playlists']);

        return data;
    }
}