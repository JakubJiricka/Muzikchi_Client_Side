import {Component, Inject, Optional, ViewEncapsulation} from '@angular/core';
import {Settings} from "vebto-client/core/config/settings.service";
import {Tracks} from "../../../web-player/tracks/tracks.service";
import {Track} from "../../../models/Track";
import {Modal} from "vebto-client/core/ui/modal.service";
import {Album} from "../../../models/Album";
import {Artist} from "../../../models/Artist";
import {UploadFileModalComponent} from "vebto-client/core/files/upload-file-modal/upload-file-modal.component";
import {MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialogRef} from "@angular/material";
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';
import {of as observableOf} from 'rxjs';
import {Search} from '../../../web-player/search/search.service';
import {WebPlayerImagesService} from '../../../web-player/web-player-images.service';

export interface CrupdateTrackModalData {
    track?: Track,
    album?: Album,
    artist?: Artist
}

@Component({
    selector: 'new-track-modal',
    templateUrl: './new-track-modal.component.html',
    styleUrls: ['./new-track-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NewTrackModalComponent {

    /**
     * Backend validation errors from last create or update request.
     */
    public errors: any = {};

    /**
     * Album this track should be attached to.
     */
    public album: Album;

    /**
     * Whether we are updating or creating a track.
     */
    public updating = false;

    public loading = false;

    /**
     * New track model.
     */
    public track = new Track();

    /**
     * Model for artists input and tags.
     */
    public artistsInput = {
        formControl: new FormControl(),
        attachedArtists: <string[]>[],
        searchResults: null,
    };

    public albumInput = {
        formControl: new FormControl(),
        searchResults: null,
    };

    /**
     * NewTrackModalComponent Constructor.
     */
    constructor(
        public settings: Settings,
        protected tracks: Tracks,
        protected modal: Modal,
        private search: Search,
        private dialogRef: MatDialogRef<NewTrackModalComponent>,
        public images: WebPlayerImagesService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: CrupdateTrackModalData,
    ) {
        this.hydrate(this.data);
        this.bindArtistsInput();
        this.bindAlbumInput();
    }

    /**
     * Confirm track creation.
     */
    public confirm() {
        //editing existing track
        if (this.track.id) {
            this.update();
        }

        //creating new track for existing album
        else if (this.album.id) {
            this.create();
        }

        //creating or updating track for new album
        else {
            this.close(this.getPayload());
        }
    }

    public close(data?: any) {
        this.dialogRef.close(data);
    }

    /**
     * Update existing track.
     */
    public update() {
        this.tracks.update(this.track.id, this.getPayload()).subscribe(track => {
            this.loading = false;
            this.dialogRef.close(track);
        }, errors => {
            this.loading = false;
            this.errors = errors.messages;
        });
    }

    /**
     * Create a new track.
     */
    public create() {
        this.tracks.create(this.getPayload()).subscribe(track => {
            this.loading = false;
            this.dialogRef.close(track);
        }, errors => {
            this.loading = false;
            this.errors = errors.messages;
        });
    }

    /**
     * Attach a new artist to track.
     */
    public attachArtist(event: MatAutocompleteSelectedEvent) {
        const artistName = event.option.value;
        this.artistsInput.formControl.setValue('');

        if ( ! artistName) return;

        //make sure artist is not already attached to track
        if (this.artistsInput.attachedArtists.findIndex(curr => curr === artistName) > -1) return;
        this.artistsInput.attachedArtists.push(artistName);
        this.errors = {};
    }

    /**
     * Detach specified artist from track.
     */
    public detachArtist(artist: string) {
        let i = this.artistsInput.attachedArtists.findIndex(curr => curr === artist);
        this.artistsInput.attachedArtists.splice(i, 1);
    }

    /**
     * Open modal for uploading track streaming file.
     */
    public openUploadMusicModal() {
        const params = {uri: 'uploads/videos', httpParams: {type: 'track'}};
        this.modal.show(UploadFileModalComponent, params).afterClosed().subscribe(uploadedFile => {
            if ( ! uploadedFile) return;
            this.track.url = uploadedFile.url;
            this.autoFillDuration(this.track.url);
        });
    }

    /**
     * Auto fill duration field using specified media file url.
     */
    public autoFillDuration(url: string) {
        if ( ! url) return;
        const audio = document.createElement('audio');

        audio.addEventListener('canplaythrough', (e) => {
            const target = (e.currentTarget || e.target) as HTMLMediaElement;

            if (target.duration) {
                this.track.duration = Math.ceil(target.duration * 1000);
            }

            audio.remove();
        });

        audio.src = url;
    }

    /**
     * Get track payload for backend.
     */
    private getPayload() {
        let payload = Object.assign({}, this.track);
        payload.album_id = this.album.id;
        payload.album_name = this.album.name;
        payload.artists = this.artistsInput.attachedArtists.join('*|*') as any;
        return payload;
    }

    /**
     * Hydrate track and album models.
     */
    private hydrate(params: CrupdateTrackModalData) {
        this.album = Object.assign({}, params.album, params.track ? params.track.album : {});

        //set track model on the modal
        if (params.track) this.track = Object.assign({}, params.track);

        //transform artists string to array
        if (typeof this.track.artists === 'string') {
            this.track.artists = this.track.artists['split']('*|*');
        }

        //track artists should always be an array
        if ( ! this.track.artists) this.track.artists = [];

        //assign track to specified artist
        if (params.artist && ! this.track.artists.length && params.artist.name) {
            this.track.artists.push(params.artist.name);
        }

        //hydrate album form control
        if (this.album) {
            this.albumInput.formControl.setValue(this.album.name);
        }

        //hydrate artists input model
        this.artistsInput.attachedArtists = this.track.artists as any;

        //hydrate track number for new tracks
        if ( ! params.track) {
            const num = this.album.tracks && this.album.tracks.length;
            this.track.number = num ? num+1 : 1;
        }

        this.updating = !!params.track;
    }

    public attachAlbum(event: MatAutocompleteSelectedEvent) {
        this.album = event.option.value;
        this.errors = {};
    }

    /**
     * Function for album autocomplete input.
     */
    public albumDisplayFn(album?: Album|Artist|string): string {
        if ( ! album) return '';

        if (typeof album === 'string') {
            return album;
        } else {
            return album.name
        }
    }

    private bindAlbumInput() {
        this.albumInput.searchResults = this.albumInput.formControl.valueChanges
            .pipe(
                distinctUntilChanged(),
                debounceTime(350),
                startWith(''),
                switchMap(query => {
                    const results = this.search.everything(this.albumDisplayFn(query), {limit: 5})
                        .pipe(map(results => results.albums));

                    return query ? results : observableOf([]);
                })
            );
    }

    private bindArtistsInput() {
        this.artistsInput.searchResults = this.artistsInput.formControl.valueChanges
            .pipe(
                distinctUntilChanged(),
                debounceTime(350),
                startWith(''),
                switchMap(query => {
                    const results = this.search.everything(this.albumDisplayFn(query), {limit: 5})
                        .pipe(map(results => results.artists));

                    return query ? results : observableOf([]);
                })
            );
    }
}
