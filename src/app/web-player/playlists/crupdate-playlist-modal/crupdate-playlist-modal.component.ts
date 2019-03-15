import {finalize} from 'rxjs/operators';
import {Component, Inject, Optional, ViewEncapsulation} from '@angular/core';
import {Playlist} from "../../../models/Playlist";
import {Playlists} from "../playlists.service";
import {Settings} from "vebto-client/core/config/settings.service";
import {Modal} from "vebto-client/core/ui/modal.service";
import {Observable} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {
    UploadedFile,
    UploadFileModalComponent
} from "vebto-client/core/files/upload-file-modal/upload-file-modal.component";
import {WebPlayerImagesService} from '../../web-player-images.service';

export interface CrupdatePlaylistModalData {
    playlist?: Playlist
}

@Component({
    selector: 'crupdate-playlist-modal',
    templateUrl: './crupdate-playlist-modal.component.html',
    styleUrls: ['./crupdate-playlist-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CrupdatePlaylistModalComponent {

    public loading: boolean = false;

    public errors: {description?: string, name?: string} = {};

    /**
     * New playlist model.
     */
    public model = new Playlist({'public': 1});

    /**
     * CrupdatePlaylistModalComponent Component.
     */
    constructor(
        private playlists: Playlists,
        private settings: Settings,
        private modal: Modal,
        private dialogRef: MatDialogRef<CrupdatePlaylistModalComponent>,
        public images: WebPlayerImagesService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data?: CrupdatePlaylistModalData,
    ) {
        this.hydrate();
    }

    /**
     * Close modal and emit crupdated playlist.
     */
    public confirm() {
        this.loading = true;

        this.crupdatePlaylist().pipe(finalize(() => {
            this.loading = false;
        })).subscribe(playlist => {
            this.dialogRef.close(playlist);
        }, response => this.errors = response.messages);
    }

    public close() {
        this.dialogRef.close();
    }

    /**
     * Create new playlist or update existing one.
     */
    private crupdatePlaylist(): Observable<Playlist> {
        const payload = {
            name: this.model.name,
            image: this.model.image,
            'public': this.model.public,
            description: this.model.description,
        };

        if (this.model.id) {
            return this.playlists.update(this.model.id, payload);
        } else {
            return this.playlists.create(payload);
        }
    }

    /**
     * Open modal for uploading playlist image.
     */
    public openImageUploadModal() {
        const params = {uri: 'uploads/images', httpParams: {type: 'playlist'}};
        this.modal.open(UploadFileModalComponent, params).afterClosed()
            .subscribe((uploadedFile: UploadedFile) => {
                if ( ! uploadedFile) return;
                this.model.image = uploadedFile.url;
            });
    }

    private hydrate() {
        if (this.data && this.data.playlist) {
            this.model = Object.assign({}, this.data.playlist);
        }

        if ( ! this.model.image) {
            this.model.image = this.images.getDefault('artist');
        }
    }
}
