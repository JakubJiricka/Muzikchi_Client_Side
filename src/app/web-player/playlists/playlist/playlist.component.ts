import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WebPlayerUrls} from "../../web-player-urls.service";
import {FormattedDuration} from "../../player/formatted-duration.service";
import {PlaylistService} from "../playlist.service";
import {PlaylistContextMenuComponent} from "../playlist-context-menu/playlist-context-menu.component";
import {Playlists} from "../playlists.service";
import {Track} from "../../../models/Track";
import {ContextMenu} from 'vebto-client/core/ui/context-menu/context-menu.service';

@Component({
    selector: 'playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PlaylistComponent implements OnInit, OnDestroy {

    /*
     * Playlist model.
     */
    public playlist: PlaylistService;

    /**
     * Formatted duration of playlist.
     */
    public totalDuration: string;

    /**
     * PlaylistComponent Constructor.
     */
    constructor(
        private route: ActivatedRoute,
        public urls: WebPlayerUrls,
        private duration: FormattedDuration,
        private contextMenu: ContextMenu,
        private playlists: Playlists,
    ) {}

    ngOnInit() {
        this.bindToRouterData();
    }

    ngOnDestroy() {
        this.playlist.destroy();
    }

    /**
     * Remove track from currently active playlist.
     */
    public removeTracksFromPlaylist(tracks: Track[]) {
        this.playlists.removeTracks(this.playlist.get().id, tracks).subscribe();
    }

    /**
     * Open playlist context menu.
     */
    public openContextMenu(e: MouseEvent) {
        e.stopPropagation();

        this.contextMenu.open(
            PlaylistContextMenuComponent,
            e.target,
            {originX: 'center', overlayX: 'center', data: {item: this.playlist.get(), extra: {image: this.playlist.getImage()}, type: 'playlist'}}
        );
    }

    /**
     * Set component playlist from resolver.
     */
    private bindToRouterData() {
        this.route.data.subscribe(data => {
            this.playlist = data.playlist;
            this.playlist.bindToPlaylistEvents();
            this.totalDuration = this.duration.toVerboseString(this.playlist.totalDuration);
        });
    }
}
