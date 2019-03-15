import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Albums} from "../../../../web-player/albums/albums.service";
import {Artist} from "../../../../models/Artist";
import {Modal} from "vebto-client/core/ui/modal.service";
import {ConfirmModalComponent} from "vebto-client/core/ui/confirm-modal/confirm-modal.component";
import {randomString} from "vebto-client/core/utils/random-string";
import {CrupdateAlbumModalComponent} from "../../../albums/crupdate-album-modal/crupdate-album-modal.component";
import {Album} from "../../../../models/Album";
import {MatSort} from '@angular/material';
import {CurrentUser} from 'vebto-client/auth/current-user';
import {DataTableSource} from 'vebto-client/admin/data-table/data/data-table-souce';
import {WebPlayerImagesService} from '../../../../web-player/web-player-images.service';

@Component({
    selector: 'artist-albums-table',
    templateUrl: './artist-albums-table.component.html',
    styleUrls: ['./artist-albums-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ArtistAlbumsTableComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;

    /**
     * Artist albums belong to.
     */
    @Input() artist: Artist;

    public dataSource: DataTableSource<Album>;

    /**
     * ArtistAlbumsTableComponent Constructor.
     */
    constructor(
        private modal: Modal,
        private albums: Albums,
        public currentUser: CurrentUser,
        public images: WebPlayerImagesService,
    ) {}

    ngOnInit() {
        this.dataSource = new DataTableSource<Album>({
            matSort: this.matSort,
            initialData: this.artist.albums.slice(),
        });
    }

    public updateAlbumsTableData() {
        this.dataSource.setData(this.artist.albums.slice());
        this.dataSource.deselectAllItems();
    }

    /**
     * Confirm and delete selected albums.
     */
    public maybeDeleteSelectedAlbums() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Albums',
            body: 'Are you sure you want to delete selected albums?',
            ok: 'Delete'
        }).beforeClose().subscribe(async (confirmed) => {
            if ( ! confirmed) return;

           const ids = this.dataSource.getSelectedItems();

            if (ids.length) {
                await this.albums.delete(ids).toPromise();
            }

            ids.forEach(identifier => {;
                let k = this.artist.albums.findIndex(curr => this.getIdentifier(curr) === identifier);
                this.artist.albums.splice(k, 1);
            });

            this.updateAlbumsTableData();
        });
    }

    /**
     * Open modal for creating a new album.
     */
    public openNewAlbumModal() {
        this.dataSource.deselectAllItems();

        this.modal.open(CrupdateAlbumModalComponent, {artist: this.artist}, 'crupdate-album-modal-container')
            .afterClosed().subscribe(album => {
                if ( ! album) return;

                album = this.setIdentifier(album);
                this.artist.albums.push(album);
                this.updateAlbumsTableData();
            });
    }

    /**
     * Open modal for editing existing album.
     */
    public openEditAlbumModal(album: Album) {
        this.dataSource.deselectAllItems();

        this.modal.open(CrupdateAlbumModalComponent, {artist: this.artist, album}, 'crupdate-album-modal-container')
            .beforeClose().subscribe(album => {
                if ( ! album) return;
                let k = this.artist.albums.findIndex(curr => this.getIdentifier(curr) === this.getIdentifier(album));
                album = this.setIdentifier(album);
                this.artist.albums[k] = album;
            });
    }

    /**
     * If album is not created in backend yet, assign an identifier
     * by which album can by found in albums array for editing.
     */
    public setIdentifier(album: Album): Album {
        if ( ! album.id) album.temp_id = randomString();
        return album;
    }

    /**
     * Get album identifier.
     */
    public getIdentifier(album: Album) {
        return album.id || album.temp_id;
    }
}
