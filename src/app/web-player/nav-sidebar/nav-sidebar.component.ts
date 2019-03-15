import {Component, ViewEncapsulation} from '@angular/core';
import {Settings} from "vebto-client/core/config/settings.service";
import {SearchSlideoutPanel} from "../search/search-slideout-panel/search-slideout-panel.service";
import {CurrentUser} from "vebto-client/auth/current-user";
import {Player} from "../player/player.service";
import {WebPlayerUrls} from "../web-player-urls.service";
import {UserPlaylists} from "../playlists/user-playlists.service";
import {Modal} from "vebto-client/core/ui/modal.service";
import {CrupdatePlaylistModalComponent} from "../playlists/crupdate-playlist-modal/crupdate-playlist-modal.component";
import {Router} from "@angular/router";
import {Track} from "../../models/Track";
import {AuthService} from "vebto-client/auth/auth.service";
import {WebPlayerImagesService} from "../web-player-images.service";
import {Search} from "../search/search.service";

@Component({
    selector: 'nav-sidebar',
    templateUrl: './nav-sidebar.component.html',
    styleUrls: ['./nav-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NavSidebarComponent {

    public langEnglish = '' ;
    public langFarsi = '' ;
    public lang = '' ;
    /**
     * NavSidebarComponent Constructor.
     */
    constructor(
        public settings: Settings,
        public search: Search,
        public searchPanel: SearchSlideoutPanel,
        public currentUser: CurrentUser,
        public player: Player,
        public urls: WebPlayerUrls,
        public auth: AuthService,
        public playlists: UserPlaylists,
        private modal: Modal,
        private router: Router,
        public wpImages: WebPlayerImagesService,
    ) {}

    ngOnInit() {
        this.lang = 'english';
        this.langChange(this.lang);
        this.langEnglish = this.settings.getAssetUrl('images/search/english_on.png');
        this.langFarsi = this.settings.getAssetUrl('images/search/farsi_off.png');
    }

    public openNewPlaylistModal() {
        if ( ! this.currentUser.isLoggedIn()) {
            this.router.navigate(['/login']);
        }

        this.modal.open(CrupdatePlaylistModalComponent, null, 'crupdate-playlist-modal-container')
            .afterClosed()
            .subscribe(playlist => {
            if ( ! playlist) return;
            this.playlists.add(playlist);
            this.router.navigate(this.urls.playlist(playlist));
        });
    }

    /**
     * Get image for specified track.
     */
    public getTrackImage(track: Track) {
        if ( ! track || ! track.album) return this.wpImages.getDefault('album');
        return track.album.image;
    }

    /**
     * img display
     */
    public langChange(lan:string) {
        if (lan === 'english') {
            this.lang = 'english';
            this.langEnglish = this.settings.getAssetUrl('images/search/english_on.png');
            this.langFarsi = this.settings.getAssetUrl('images/search/farsi_off.png');
        } else if (lan === 'farsi') {
            this.lang = 'farsi';
            this.langEnglish = this.settings.getAssetUrl('images/search/english_off.png');
            this.langFarsi = this.settings.getAssetUrl('images/search/farsi_on.png');
        }
        this.search.clearCache().subscribe(response=>{});
        this.search.chnageLanguage(lan).subscribe(response=>{});
    }

    //this.settings.getAssetUrl('images/default/album.png');


}
