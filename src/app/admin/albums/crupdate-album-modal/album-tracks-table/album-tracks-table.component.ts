import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Tracks} from "../../../../web-player/tracks/tracks.service";
import {Track} from "../../../../models/Track";
import {Album} from "../../../../models/Album";
import {Artist} from "../../../../models/Artist";
import {Modal} from "vebto-client/core/ui/modal.service";
import {NewTrackModalComponent} from "../../../tracks/new-track-modal/new-track-modal.component";
import {ConfirmModalComponent} from "vebto-client/core/ui/confirm-modal/confirm-modal.component";
import {randomString} from "vebto-client/core/utils/random-string";
import {MatSort} from '@angular/material';
import {FormattedDuration} from '../../../../web-player/player/formatted-duration.service';
import {CurrentUser} from 'vebto-client/auth/current-user';
import {DataTableSource} from 'vebto-client/admin/data-table/data/data-table-souce';

@Component({
    selector: 'album-tracks-table',
    templateUrl: './album-tracks-table.component.html',
    styleUrls: ['./album-tracks-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AlbumTracksTableComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;

    /**
     * Album tracks belong to.
     */
    @Input() album: Album;

    /**
     * Artist album belongs to.
     */
    @Input() artist: Artist;

    public dataSource: DataTableSource<Track>;

    /**
     * AlbumTracksTableComponent Constructor.
     */
    constructor(
        private modal: Modal,
        private tracks: Tracks,
        private duration: FormattedDuration,
        public currentUser: CurrentUser,
    ) {}

    ngOnInit() {
        this.dataSource = new DataTableSource<Track>({
            matSort: this.matSort,
            initialData: this.album.tracks.slice(),
        });
    }

    public updateTracksTableData() {
        this.dataSource.setData(this.album.tracks.slice());
        this.dataSource.deselectAllItems();
    }

    /**
     * Open modal for creating a new track.
     */
    public openNewTrackModal() {
        this.dataSource.deselectAllItems();

        this.modal.open(
            NewTrackModalComponent,
            {album: this.album, artist: this.artist},
            'new-track-modal-container'
        )
        .afterClosed().subscribe(track => {
            if ( ! track) return;
            track = this.setIdentifier(track);
            this.album.tracks.unshift(track);
            this.updateTracksTableData();
        });
    }

    /**
     * Open modal for editing existing track.
     */
    public openEditTrackModal(track: Track) {
        this.dataSource.deselectAllItems();

        this.modal.open(
            NewTrackModalComponent,
            {album: this.album, track, artist: this.artist},
            'new-track-modal-container'
        )
        .afterClosed()
        .subscribe(track => {
            if ( ! track) return;
            let k = this.album.tracks.findIndex(curr => this.getIdentifier(curr) === this.getIdentifier(track));
            track = this.setIdentifier(track);
            this.album.tracks[k] = track;
            this.updateTracksTableData();
        });
    }

    /**
     * Confirm and delete selected tracks.
     */
    public maybeDeleteSelectedTracks() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Tracks',
            body: 'Are you sure you want to delete selected tracks?',
            ok: 'Delete'
        }).afterClosed().subscribe(async confirmed => {
            if ( ! confirmed) return;

            const ids = this.dataSource.getSelectedItems();

            if (ids.length) {
                await this.tracks.delete(ids).toPromise();
            }

            ids.forEach(identifier => {
                let k = this.album.tracks.findIndex(curr => this.getIdentifier(curr) === identifier);
                this.album.tracks.splice(k, 1);
            });

            this.updateTracksTableData();
        });
    }

    public formatTrackDuration(track: Track) {
        return this.duration.fromMilliseconds(track.duration);
    }


    /**
     * If track is not created in backend yet, assign an identifier
     * by which track can by find in tracks array for editing.
     */
    public setIdentifier(track: Track): Track {
        if ( ! track.id) track.temp_id = randomString();
        return track;
    }

    /**
     * Get track identifier.
     */
    public getIdentifier(track: Track) {
        return track.id || track.temp_id;
    }
}
