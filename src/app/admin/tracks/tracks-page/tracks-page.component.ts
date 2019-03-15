import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Tracks} from "../../../web-player/tracks/tracks.service";
import {FormattedDuration} from "../../../web-player/player/formatted-duration.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UrlAwarePaginator} from "vebto-client/admin/pagination/url-aware-paginator.service";
import {Modal} from "vebto-client/core/ui/modal.service";
import {CurrentUser} from "vebto-client/auth/current-user";
import {Track} from '../../../models/Track';
import {MatSort} from '@angular/material';
import {NewTrackModalComponent} from '../new-track-modal/new-track-modal.component';
import {CrupdateLyricModalComponent} from '../../lyrics-page/crupdate-lyric-modal/crupdate-lyric-modal.component';
import {ConfirmModalComponent} from 'vebto-client/core/ui/confirm-modal/confirm-modal.component';
import {PaginatedDataTableSource} from 'vebto-client/admin/data-table/data/paginated-data-table-source';

@Component({
    selector: 'tracks-page',
    templateUrl: './tracks-page.component.html',
    styleUrls: ['./tracks-page.component.scss'],
    providers: [UrlAwarePaginator],
    encapsulation: ViewEncapsulation.None
})
export class TracksPageComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Track>;

    /**
     * TracksPageComponent Constructor.
     */
    constructor(
        private modal: Modal,
        private tracks: Tracks,
        private duration: FormattedDuration,
        private route: ActivatedRoute,
        private router: Router,
        public currentUser: CurrentUser,
        private paginator: UrlAwarePaginator,
    ) {}

    ngOnInit() {
        this.crupdateTrackBasedOnQueryParams();

        this.dataSource = new PaginatedDataTableSource<Track>({
            uri: 'tracks',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {order_by: 'spotify_popularity', with: 'album,lyric'}
        });
    }

    /**
     * Open modal for editing existing track or creating a new one.
     */
    public openCrupdateTrackModal(track?: Track) {
        this.dataSource.deselectAllItems();

        this.modal.open(NewTrackModalComponent, {track}, 'new-track-modal-container')
            .afterClosed().subscribe(track => track && this.dataSource.refresh());
    }

    /**
     * Open modal for editing or creating track's lyric.
     */
    public openCrupdateLyricModal(track: Track) {
        this.modal.open(CrupdateLyricModalComponent, {track, lyric: track.lyric}, 'crupdate-lyric-modal-container')
            .afterClosed().subscribe(lyric => {
            if ( ! lyric) return;
            track.lyric = lyric;
        });
    }

    /**
     * Ask user to confirm deletion of selected tracks
     * and delete selected artists if user confirms.
     */
    public maybeDeleteSelectedTracks() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Tracks',
            body:  'Are you sure you want to delete selected tracks?',
            ok:    'Delete'
        }).beforeClose().subscribe(confirmed => {
            if (confirmed) {
                this.deleteSelectedTracks();
            } else {
                this.dataSource.deselectAllItems();
            }
        });
    }

    /**
     * Delete currently selected artists.
     */
    private deleteSelectedTracks() {
        const ids = this.dataSource.selectedRows.selected.map(track => track.id);

        this.tracks.delete(ids).subscribe(() => {
            this.dataSource.refresh();
        });
    }

    public formatDuration(duration: number) {
        return this.duration.fromMilliseconds(duration);
    }

    /**
     * Open crupdate track modal if track id is specified in query params.
     */
    private crupdateTrackBasedOnQueryParams() {
        let trackId = +this.route.snapshot.queryParamMap.get('track_id'),
            newATrack = this.route.snapshot.queryParamMap.get('newTrack');

        if ( ! trackId && ! newATrack) return;

        this.router.navigate([], {replaceUrl: true}).then(async () => {
            let track = trackId ? await this.tracks.get(trackId).toPromise() : null;

            this.openCrupdateTrackModal(track);
        });
    }
}
