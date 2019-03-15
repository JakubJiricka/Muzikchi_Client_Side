import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Artists} from "../../web-player/artists/artists.service";
import {UrlAwarePaginator} from "vebto-client/admin/pagination/url-aware-paginator.service";
import {CurrentUser} from "vebto-client/auth/current-user";
import {Modal} from "vebto-client/core/ui/modal.service";
import {MatSort} from "@angular/material";
import {Artist} from "../../models/Artist";
import {ConfirmModalComponent} from "vebto-client/core/ui/confirm-modal/confirm-modal.component";
import {PaginatedDataTableSource} from 'vebto-client/admin/data-table/data/paginated-data-table-source';

@Component({
    selector: 'artists',
    templateUrl: './artists.component.html',
    providers: [UrlAwarePaginator],
    encapsulation: ViewEncapsulation.None,
})
export class ArtistsComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Artist>;

    /**
     * ArtistsComponent Constructor.
     */
    constructor(
        public paginator: UrlAwarePaginator,
        private artists: Artists,
        private modal: Modal,
        public currentUser: CurrentUser,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Artist>({
            uri: 'artists',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {order_by: 'spotify_popularity'},
        });
    }

    /**
     * Ask user to confirm deletion of selected artists
     * and delete selected artists if user confirms.
     */
    public maybeDeleteSelectedArtists() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Artists',
            body:  'Are you sure you want to delete selected artists?',
            ok:    'Delete'
        }).beforeClose().subscribe(confirmed => {
            if (confirmed) {
                this.deleteSelectedArtists();
            } else {
                this.dataSource.deselectAllItems();
            }
        });
    }

    /**
     * Delete currently selected artists.
     */
    public deleteSelectedArtists() {
        const ids = this.dataSource.getSelectedItems();

        this.artists.delete(ids).subscribe(() => {
            this.paginator.refresh();
            this.dataSource.deselectAllItems();
        });
    }
}
