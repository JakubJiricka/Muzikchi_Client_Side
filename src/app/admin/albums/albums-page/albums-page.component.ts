import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Settings} from "vebto-client/core/config/settings.service";
import {Albums} from "../../../web-player/albums/albums.service";
import {CrupdateAlbumModalComponent} from "../crupdate-album-modal/crupdate-album-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {UrlAwarePaginator} from "vebto-client/admin/pagination/url-aware-paginator.service";
import {Modal} from "vebto-client/core/ui/modal.service";
import {MatSort} from "@angular/material";
import {Album} from "../../../models/Album";
import {ConfirmModalComponent} from "vebto-client/core/ui/confirm-modal/confirm-modal.component";
import {CurrentUser} from "vebto-client/auth/current-user";
import {WebPlayerUrls} from "../../../web-player/web-player-urls.service";
import {PaginatedDataTableSource} from 'vebto-client/admin/data-table/data/paginated-data-table-source';
import {WebPlayerImagesService} from '../../../web-player/web-player-images.service';

@Component({
    selector: 'albums-page',
    templateUrl: './albums-page.component.html',
    styleUrls: ['./albums-page.component.scss'],
    providers: [UrlAwarePaginator],
    encapsulation: ViewEncapsulation.None
})
export class AlbumsPageComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Album>;

    /**
     * AlbumsPageComponent Constructor.
     */
    constructor(
        private paginator: UrlAwarePaginator,
        private settings: Settings,
        private modal: Modal,
        private albums: Albums,
        private route: ActivatedRoute,
        private router: Router,
        public currentUser: CurrentUser,
        public urls: WebPlayerUrls,
        public images: WebPlayerImagesService,
    ) {}

    ngOnInit() {
        this.crupdateAlbumBasedOnQueryParams();

        this.dataSource = new PaginatedDataTableSource<Album>({
            uri: 'albums',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {order_by: 'spotify_popularity', 'with': 'tracks'}
        });
    }

    /**
     * Open modal for editing existing album or creating a new one.
     */
    public openCrupdateAlbumModal(album?: Album) {
        this.dataSource.deselectAllItems();
        const artist = album ? album.artist : null;

        this.modal.open(
            CrupdateAlbumModalComponent,
            {album, artist},
            'crupdate-album-modal-container'
        )
        .afterClosed()
        .subscribe(() => {
            this.dataSource.deselectAllItems();
            this.paginator.refresh();
        });
    }

    /**
     * Ask user to confirm deletion of selected albums
     * and delete selected artists if user confirms.
     */
    public maybeDeleteSelectedAlbums() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Albums',
            body:  'Are you sure you want to delete selected albums?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedAlbums();
        });
    }

    /**
     * Get available album image url or default one.
     */
    public getAlbumImage(album: Album): string {
        if (album.image) return album.image;
        return this.images.getDefault('album');
    }

    /**
     * Delete currently selected artists.
     */
    private deleteSelectedAlbums() {
        const ids = this.dataSource.getSelectedItems();

        this.albums.delete(ids).subscribe(() => {
            this.dataSource.deselectAllItems();
            this.paginator.refresh();
        });
    }

    /**
     * Open crupdate album modal if album id is specified in query params.
     */
    private crupdateAlbumBasedOnQueryParams() {
        let albumId = +this.route.snapshot.queryParamMap.get('album_id'),
            newAlbum = this.route.snapshot.queryParamMap.get('newAlbum');

        if ( ! albumId && ! newAlbum) return;

        this.router.navigate([], {replaceUrl: true}).then(async () => {
            let album = albumId ? await this.albums.get(albumId).toPromise() : null;

            this.openCrupdateAlbumModal(album);
        });
    }
}
