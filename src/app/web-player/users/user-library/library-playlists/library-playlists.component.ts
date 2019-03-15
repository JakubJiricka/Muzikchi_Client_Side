import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {WebPlayerUrls} from "../../../web-player-urls.service";
import {Playlist} from "../../../../models/Playlist";
import {PlaylistContextMenuComponent} from "../../../playlists/playlist-context-menu/playlist-context-menu.component";
import {ActivatedRoute} from "@angular/router";
import {Settings} from "vebto-client/core/config/settings.service";
import {WebPlayerImagesService} from "../../../web-player-images.service";
import {ContextMenu} from 'vebto-client/core/ui/context-menu/context-menu.service';

@Component({
    selector: 'library-playlists',
    templateUrl: './library-playlists.component.html',
    styleUrls: ['./library-playlists.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {class: 'user-library-page'},
})
export class LibraryPlaylistsComponent implements OnInit {

    /**
     * All current user playlists.
     */
    public playlists: Playlist[] = [];

    /**
     * LibraryPlaylistsComponent Constructor.
     */
    constructor(
        public urls: WebPlayerUrls,
        private settings: Settings,
        private contextMenu: ContextMenu,
        private route: ActivatedRoute,
        public wpImages: WebPlayerImagesService,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.playlists = data.playlists;
        });
    }

    /**
     * Get playlist image.
     */
    public getImage(playlist: Playlist) {
        if (playlist.image) return playlist.image;
        if (playlist.tracks && playlist.tracks.length) return playlist.tracks[0].album.image;
        return this.wpImages.getDefault('artist');
    }

    /**
     * Open playlist context menu.
     */
    public showContextMenu(playlist: Playlist, e: MouseEvent) {
        e.stopPropagation();

        this.contextMenu.open(
            PlaylistContextMenuComponent,
            e.target,
            {data: {item: playlist, extra: {image: this.getImage(playlist)}, type: 'playlist'}}
        );
    }
}
