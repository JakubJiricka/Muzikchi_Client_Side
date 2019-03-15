import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Lyrics} from "../../web-player/lyrics/lyrics.service";
import {Lyric} from "../../models/Lyric";
import {Settings} from "vebto-client/core/config/settings.service";
import {CrupdateLyricModalComponent} from "./crupdate-lyric-modal/crupdate-lyric-modal.component";
import {UrlAwarePaginator} from "vebto-client/admin/pagination/url-aware-paginator.service";
import {Modal} from "vebto-client/core/ui/modal.service";
import {CurrentUser} from "vebto-client/auth/current-user";
import {MatSort} from "@angular/material";
import {ConfirmModalComponent} from "vebto-client/core/ui/confirm-modal/confirm-modal.component";
import {PaginatedDataTableSource} from 'vebto-client/admin/data-table/data/paginated-data-table-source';
import {WebPlayerImagesService} from '../../web-player/web-player-images.service';

@Component({
    selector: 'lyrics-page',
    templateUrl: './lyrics-page.component.html',
    styleUrls: ['./lyrics-page.component.scss'],
    providers: [UrlAwarePaginator],
    encapsulation: ViewEncapsulation.None
})
export class LyricsPageComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Lyric>;

    /**
     * PagesComponent Constructor.
     */
    constructor(
        public paginator: UrlAwarePaginator,
        private lyrics: Lyrics,
        private modal: Modal,
        public currentUser: CurrentUser,
        private settings: Settings,
        private images: WebPlayerImagesService,
    ) {}

    /**
     * Fetch initial pages to display.
     */
    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Lyric>({
            uri: 'lyrics',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {with: 'track.album.artist'},
        });
    }

    /**
     * Show modal for creating a new lyric or updating existing one.
     */
    public openCrupdateLyricModal(lyric?: Lyric) {
        this.modal.open(CrupdateLyricModalComponent, {lyric}, 'crupdate-lyric-modal-container')
            .afterClosed().subscribe(() => {
                this.dataSource.deselectAllItems();
                this.paginator.refresh();
            });
    }

    /**
     * Ask user to confirm deletion of selected lyrics
     * and delete selected lyrics if user confirms.
     */
    public confirmLyricsDeletion() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Lyrics',
            body: 'Are you sure you want to delete selected lyrics?',
            ok: 'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedLyrics();
        });
    }

    /**
     * Delete currently selected pages.
     */
    public deleteSelectedLyrics() {
        const ids = this.dataSource.getSelectedItems();

        this.lyrics.delete(ids).subscribe(() => {
            this.paginator.refresh();
            this.dataSource.deselectAllItems();
        });
    }

    /**
     * Get image for specified lyric.
     */
    public getLyricImage(lyric: Lyric): string {
        if (lyric.track && lyric.track.album.image) return lyric.track.album.image;
        return this.images.getDefault('album');
    }
}
