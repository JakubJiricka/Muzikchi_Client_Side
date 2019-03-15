import {AfterViewInit, Component, Inject, Optional, ViewChild, ViewEncapsulation} from '@angular/core';
import {Lyrics} from "../../../web-player/lyrics/lyrics.service";
import {Observable, of as observableOf} from "rxjs";
import {TextEditorComponent} from "vebto-client/text-editor/text-editor.component";
import {Track} from "../../../models/Track";
import {Lyric} from "../../../models/Lyric";
import {MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialogRef} from "@angular/material";
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap} from 'rxjs/operators';
import {Search} from '../../../web-player/search/search.service';
import {WebPlayerImagesService} from '../../../web-player/web-player-images.service';

export interface CrupdateLyricModalData {
    lyric?: Lyric,
    track?: Track
}

@Component({
    selector: 'crupdate-lyric-modal',
    templateUrl: './crupdate-lyric-modal.component.html',
    styleUrls: ['./crupdate-lyric-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CrupdateLyricModalComponent implements AfterViewInit {
    @ViewChild('textEditor') textEditor: TextEditorComponent;

    /**
     * Track this lyric belong to.
     */
    public track: Track = new Track();

    /**
     * Lyric model.
     */
    public lyric = new Lyric({text: ''});

    /**
     * Input for attaching lyric to a track.
     */
    public trackInput = {
        formControl: new FormControl(),
        searchResults: null,
    };

    public loading: boolean = false;

    public errors: {track_id?: string, text?: string} = {};

    /**
     * CrupdateLyricModalComponent Constructor.
     */
    constructor(
        protected lyrics: Lyrics,
        private dialogRef: MatDialogRef<CrupdateLyricModalComponent>,
        private search: Search,
        public images: WebPlayerImagesService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: CrupdateLyricModalData,
    ) {
        this.hydrate();
        this.bindTrackInput();
    }

    ngAfterViewInit() {
        this.textEditor.setContents(this.lyric.text);
        this.textEditor.focus();
    }

    /**
     * Confirm track creation.
     */
    public confirm() {
        this.loading = true;

        this.createOrUpdateLyrics()
            .pipe(finalize(() => this.loading = false))
            .subscribe(lyric => {
                this.close(lyric);
            }, response => {
                this.errors = response.messages;
            });
    }

    /**
     * Close the modal.
     */
    public close(lyric?: Lyric) {
        this.dialogRef.close(lyric);
        this.textEditor.destroyEditor();
    }

    /**
     * Create a new lyric or update existing one.
     */
    private createOrUpdateLyrics(): Observable<Lyric> {
        if (this.lyric.id) {
            return this.lyrics.update(this.lyric.id, this.getPayload());
        } else {
            return this.lyrics.create(this.getPayload());
        }
    }

    private getPayload() {
        return {
            text: this.textEditor.getContents(),
            track_id: this.track.id,
        }
    }

    private hydrate() {
        if (this.data.lyric) {
            this.lyric = this.data.lyric;
        }

        this.track = this.data.track || this.lyric.track;
        this.trackInput.formControl.setValue(this.track);
    }

    /**
     * Function for track autocomplete input.
     */
    public trackDisplayFn(track?: Track|string): string {
        if ( ! track) return '';

        if (typeof track === 'string') {
            return track;
        } else {
            return track.name;
        }
    }

    private bindTrackInput() {
        this.trackInput.searchResults = this.trackInput.formControl.valueChanges
            .pipe(
                distinctUntilChanged(),
                debounceTime(350),
                startWith(''),
                switchMap(query => {
                    const searchQuery = this.trackDisplayFn(query);

                    const results = this.search.everything(searchQuery, {limit: 5})
                        .pipe(map(results => results.tracks));

                    //make sure search is not triggered after user clicks on autocomplete result
                    return (searchQuery && (! this.track || searchQuery !== this.track.name)) ? results : observableOf([]);
                })
            );
    }

    public attachTrack(event: MatAutocompleteSelectedEvent) {
        this.track = event.option.value;
        this.errors = {};
    }
}
