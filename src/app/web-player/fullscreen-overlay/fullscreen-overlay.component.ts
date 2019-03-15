import {Component,Input, ElementRef, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {PlayerQueue} from "../player/player-queue.service";
import {Track} from "../../models/Track";
import {FullscreenOverlay} from "./fullscreen-overlay.service";
import {Player} from "../player/player.service";
import {TrackContextMenuComponent} from "../tracks/track-context-menu/track-context-menu.component";
import {Subscription} from "rxjs";
import {WebPlayerState} from "../web-player-state.service";
import {BrowserEvents} from "vebto-client/core/services/browser-events.service";
import {WebPlayerImagesService} from "../web-player-images.service";
import {ContextMenu} from 'vebto-client/core/ui/context-menu/context-menu.service';
//
import {CurrentUser} from "vebto-client/auth/current-user";
import {Tracks} from "../tracks/tracks.service";
import {WpUtils} from "../web-player-utils";
import {Album} from "../../models/Album";
import {Albums} from "../albums/albums.service";
import {Observable} from "rxjs";
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {coerceNumberProperty} from '@angular/cdk/coercion';



@Component({
    selector: 'fullscreen-overlay',
    templateUrl: './fullscreen-overlay.component.html',
    styleUrls: ['./fullscreen-overlay.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.maximized]': 'overlay.isMaximized()',
        'class': 'fullscreen-overlay',
    }
})
export class FullscreenOverlayComponent implements OnInit, OnDestroy {
    /**
     * Active component subscription.
     */
    public subscription: Subscription;
    //
    public track: Observable<Track>;
    public album: Observable<Album>;
    public trackId: number;
    public album_id: number;
    public loading = false;
    public user_id: number;
    public score: number;
    public errors: any = {};
    /**
     * FullscreenOverlayComponent Constructor.
     */
    constructor(
        public player: Player,
        private el: ElementRef,
        public queue: PlayerQueue,
        private contextMenu: ContextMenu,
        public overlay: FullscreenOverlay,
        private browserEvents: BrowserEvents,
        public state: WebPlayerState,
        public wpImages: WebPlayerImagesService,
        //
        public currentUser: CurrentUser,
        public tracks : Tracks,
        private albums: Albums,
        private router: Router,

    ) {}

    ngOnInit () {
        this.subscription = this.browserEvents.globalKeyDown$.subscribe(e => {
            //minimize overlay on ESC key press.
            if (e.keyCode === this.browserEvents.keyCodes.escape) {
                this.overlay.minimize();
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription = null;
    }

    /**
     * Get current track in player queue.
     */
    public getCurrent() {
        return this.queue.getCurrent() || new Track();
    }

    /**
     * Get previous track in player queue.
     */
    public getPrevious() {
        return this.queue.getPrevious() || this.getCurrent();
    }

    /**
     * Get next track in player queue.
     */
    public getNext() {
        return this.queue.getNext() || this.getCurrent();
    }

    /**
     * Get image for specified track.
     */
    public getTrackImage(track: Track) {
        if ( ! track || ! track.album) return this.wpImages.getDefault('album');
        return track.track_image;
    }

    /**
     * Open track context menu.
     */
    public openTrackContextMenu(track: Track, e: MouseEvent) {
        e.stopPropagation();

        this.contextMenu.open(
            TrackContextMenuComponent,
            e.target,
            {data: {item: track, type: 'track'}}
        );
    }


    /**
     * Exit browser fullscreen mode or minimize the overlay.
     */
    public minimize() {
        if (this.isBrowserFullscreen()) {
            this.exitBrowserFullscreen();
        } else {
            this.overlay.minimize();
        }
    }

    /**
     * Toggle browser fullscreen mode.
     */
    public toggleBrowserFullscreen() {
        let el = this.el.nativeElement;

        if (this.isBrowserFullscreen()) {
            return this.exitBrowserFullscreen();
        }

        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.webkitRequestFullScreen) {
            el.webkitRequestFullScreen();
        }
    }

    /**
     * Exit browser fullscreen mode.
     */
    public exitBrowserFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document['mozCancelFullScreen']) {
            document['mozCancelFullScreen']();
        } else if (document['msExitFullscreen']) {
            document['msExitFullscreen']();
        }
    }

    /**
     * Check if browser fullscreen mode is active.
     */
    public isBrowserFullscreen() {
        return document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document['mozFullscreenElement'] ||
        document['msFullScreenElement'];
    }

    /**
     * change current taskgetCu
     */
    public changeCurrent(){
        this.trackId = this.getCurrent().score_high_track_id;
        this.player.stop();
        this.player.state.buffering = true;
        this.tracks.get(this.trackId).toPromise().then(track => {
            this.state.loading = false;
            if (track) {
                //get track
                this.albums.get(track.album_id).toPromise().then(album => {
                    this.state.loading = false;
                    if (album) {
                        //get album
                        const track_s = WpUtils.assignAlbumToTracks(album.tracks, album);
                        this.player.overrideQueue({
                            tracks: track_s,
                            queuedItemId: album.id
                        }).then(() => {
                            this.player.play();
                        });
                        //end album
                    } else {
                        this.router.navigate(['/']);
                        return null;
                    }
                }).catch(() => {
                    this.state.loading = false;
                    this.router.navigate(['/']);
                }) as any;

                //end track
            } else {
                this.router.navigate(['/']);
                return null;
            }
        }).catch(() => {
            this.state.loading = false;
            this.router.navigate(['/']);
        }) as any;
    }
    /*
    * changeSlider
     */
    onSearchChange(searchValue : number ) {

        this.user_id = this.currentUser.getModel().id;
        this.score   = searchValue;

        this.router.navigate(['/']);
        let payload = Object.assign({}, new Track);
        payload.user_id = this.user_id;
        payload.score   = searchValue;
        payload.id      = this.getCurrent().id;

        this.loading = true;
        this.tracks.createScore(payload).toPromise().then(track => {
            this.loading = false;
            this.getCurrent().score = track.score;
            this.getCurrent().score_high = track.score_high;
            return track;
        }).catch(errors => {
            this.errors = errors.messages;
            this.loading = false;
            this.router.navigate(['/']);
        }) as Promise<Track>;
    }

}
