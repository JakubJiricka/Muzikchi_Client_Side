import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Settings} from "vebto-client/core/config/settings.service";
import {Artists} from "../../../web-player/artists/artists.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Genre} from "../../../models/Genre";
import {Artist} from "../../../models/Artist";
import {Modal} from "vebto-client/core/ui/modal.service";
import {Toast} from "vebto-client/core/ui/toast.service";
import {UploadFileModalComponent} from "vebto-client/core/files/upload-file-modal/upload-file-modal.component";
import {WebPlayerImagesService} from '../../../web-player/web-player-images.service';

@Component({
    selector: 'new-artist-page',
    templateUrl: './new-artist-page.component.html',
    styleUrls: ['./new-artist-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NewArtistPageComponent implements OnInit {

    /**
     * Backend validation errors from last request.
     */
    public errors: any = {};

    /**
     * New artist model.
     */
    public artist = new Artist({albums: [], genres: []});

    /**
     * Artist biography model.
     */
    public bio = {text: '', images: ''};

    /**
     * Genre input model.
     */
    public genre: string;

    /**
     * NewArtistPageComponent Constructor.
     */
    constructor(
        private settings: Settings,
        private modal: Modal,
        private artists: Artists,
        private route: ActivatedRoute,
        private toast: Toast,
        private router: Router,
        public images: WebPlayerImagesService,
    ) {}

    ngOnInit() {
        this.bindToRouteData();
    }

    /**
     * Create or update artist based on model id.
     */
    public createOrUpdate() {
        this.artist.id ? this.update() : this.create();
    }

    /**
     * Create a new artist.
     */
    public create() {
        return this.artists.create(this.getPayload()).subscribe(artist => {
            this.artist = artist;
            this.toast.open('Artist created.');
            this.errors = {};
            this.router.navigate(['/admin/artists', this.artist.id, 'edit'], {replaceUrl: true})
        }, errors => {
            this.errors = errors.messages;
        });
    }

    /**
     * Update existing artist.
     */
    public update() {
        return this.artists.update(this.artist.id, this.getPayload()).subscribe(artist => {
            this.artist = artist;
            this.toast.open('Artist updated.');
            this.errors = {};
        }, errors => {
            this.errors = errors.messages;
        });
    }

    /**
     * Add a new genre to artist.
     */
    public addGenre() {
        if ( ! this.genre) return;

        //check if artist already has this genre
        if (this.artist.genres.findIndex(curr => curr.name === this.genre) > -1) return;

        this.artist.genres.push(new Genre({name: this.genre}));
        this.genre = null;
    }

    /**
     * Remove existing genre from artist.
     */
    public removeGenre(genre: Genre) {
        let i = this.artist.genres.findIndex(curr => curr.name === genre.name);
        this.artist.genres.splice(i, 1);
    }

    /**
     * Open modal for uploading a new image for artist.
     */
    public openInsertImageModal(type: 'small'|'large') {
        const params = {uri: 'uploads/images', httpParams: {type: 'artist'}};
        this.modal.show(UploadFileModalComponent, params).afterClosed().subscribe(uploadedFile => {
            if ( ! uploadedFile) return;
            this.artist['image_'+type] = uploadedFile.url;
        });
    }

    /**
     * Get available artist image url or default one.
     */
    public getArtistImage(): string {
        if (this.artist.image_small) return this.artist.image_small;
        if (this.artist.image_large) return this.artist.image_large;
        return this.images.getDefault('artist');
    }

    /**
     * Get payload for creating new artist or updating existing one.
     */
    private getPayload() {
        let payload = Object.assign({}, this.artist);
        let images = this.bio.images.split("\n").map(url => { return {url}});
        payload.bio = JSON.stringify({bio: this.bio.text, images});
        if (this.artist.id) delete payload.albums;
        return payload;
    }

    /**
     * Bind to route data and hydrate artist model.
     */
    private bindToRouteData() {
        this.route.data.subscribe(data => {
            if (data.artist) {
                this.artist = data.artist;
                this.bio.text = data.artist.bio.bio;

                if ( ! data.artist.bio.images) data.artist.bio.images = [];
                this.bio.images = data.artist.bio.images.map(image => {
                    return image.url;
                }).join("\n");
            }
        });
    }
}
