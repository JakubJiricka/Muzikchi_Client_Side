import {finalize} from 'rxjs/operators';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Player} from "../player.service";
import {FullscreenOverlay} from "../../fullscreen-overlay/fullscreen-overlay.service";
import {QueueSidebar} from "../../queue-sidebar/queue-sidebar.service";
import {Lyrics} from "../../lyrics/lyrics.service";
import {Modal} from "vebto-client/core/ui/modal.service";
import {LyricsModalComponent} from "../../lyrics/lyrics-modal/lyrics-modal.component";
import {WebPlayerState} from "../../web-player-state.service";
import {Settings} from "vebto-client/core/config/settings.service";
import {Toast} from "vebto-client/core/ui/toast.service";
import {WebPlayerUrls} from '../../web-player-urls.service';
import {Uploads} from 'vebto-client/core/files/uploads.service';

@Component({
    selector: 'player-controls',
    templateUrl: './player-controls.component.html',
    styleUrls: ['./player-controls.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PlayerControlsComponent implements OnInit {

    public shouldHideLyricsButton = false;
    public shouldHideVideoButton = false;
    public shouldHideDownloadButton = true;

    /**
     * PlayerControlsComponent Constructor.
     */
    constructor(
        public player: Player,
        private lyrics: Lyrics,
        private modal: Modal,
        public overlay: FullscreenOverlay,
        public queueSidebar: QueueSidebar,
        private webPlayerState: WebPlayerState,
        private settings: Settings,
        private toast: Toast,
        private urls: WebPlayerUrls,
    ) {}

    ngOnInit() {
        this.shouldHideLyricsButton = this.settings.get('player.hide_lyrics');
        this.shouldHideVideoButton = this.settings.get('player.hide_video_button');
        this.shouldHideDownloadButton = !this.settings.get('player.enable_download');
    }

    /**
     * Fetch lyrics and show lyrics modal.
     */
    public showLyricsModal() {
        const track = this.player.getCuedTrack();
        if ( ! track) return;

        this.webPlayerState.loading = true;

        this.lyrics.get(track.id).pipe(finalize(() => {
            this.webPlayerState.loading = false;
        })).subscribe(lyric => {
            this.modal.open(LyricsModalComponent, {lyrics: lyric.text}, 'lyrics-modal-container');
        }, () => {
            this.toast.open('Could not find lyrics for this song.');
        });
    }

    public downloadCurrentTrack() {
        const cued = this.player.getCuedTrack();
        if ( ! cued) return;
        Uploads.downloadFileFromUrl(this.urls.trackDownload(cued));
    }
}
