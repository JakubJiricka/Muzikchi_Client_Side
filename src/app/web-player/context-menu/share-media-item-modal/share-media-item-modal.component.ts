import {Component, Inject, Optional, ViewEncapsulation} from '@angular/core';
import {Artist} from "../../../models/Artist";
import {Album} from "../../../models/Album";
import {Track} from "../../../models/Track";
import {WebPlayerUrls} from "../../web-player-urls.service";
import * as copyToClipboard from 'copy-to-clipboard';
import {Toast} from "vebto-client/core/ui/toast.service";
import {Settings} from "vebto-client/core/config/settings.service";
import {Playlist} from "../../../models/Playlist";
import {AppHttpClient} from "vebto-client/core/http/app-http-client.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

type mediaItemModel = Track|Album|Artist|Playlist;
type mediaItemType = 'artist'|'album'|'track'|'playist-track'|'playlist';

export interface ShareMediaItemModalData {
    mediaItem: mediaItemModel,
    type: mediaItemType
}

@Component({
    selector: 'share-media-item-modal',
    templateUrl: './share-media-item-modal.component.html',
    styleUrls: ['./share-media-item-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShareMediaItemModalComponent {

    /**
     * Media item model.
     */
    public mediaItem: mediaItemModel;

    /**
     * Type of media item.
     */
    public type: mediaItemType;

    /**
     * Absolute media item url.
     */
    public link: string;

    public loading: boolean = false;

    /**
     * Data for sharing media item via email.
     */
    public email = {
        address: '',
        addresses: [],
        message: ''
    };

    /**
     * ShareMediaItemModal Component.
     */
    constructor(
        private urls: WebPlayerUrls,
        private toast: Toast,
        private settings: Settings,
        private http: AppHttpClient,
        private dialogRef: MatDialogRef<ShareMediaItemModalComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: ShareMediaItemModalData,
    ) {
        this.mediaItem = data.mediaItem;
        this.type = this.setType(data.type);
        this.link = this.getLink();
    }

    /**
     * Close the modal and share media item via email.
     */
    public confirm() {
        this.addEmail();

        if (this.email.addresses.length) {
            this.loading = true;

            this.http.post('media-items/links/send', {
                name: this.mediaItem.name,
                emails: this.email.addresses,
                message: this.email.message,
                link: this.getLink(),
            }).subscribe(() => {
                this.toast.open('Shared '+this.mediaItem.name);
                this.close();
            }, () => {
                this.toast.open('There was an issue with sharing '+this.mediaItem.name);
                this.loading = false;
            });
        }
    }

    public close() {
        this.loading = false;
        this.dialogRef.close();
    }

    /**
     * Share media item on specified social network.
     */
    public shareUsing(network: string) {
        let width  = 575,
            height = 400,
            left   = (window.innerWidth  - width)  / 2,
            top    = (window.innerHeight - height) / 2,
            url    = this.getSocialMediaUrl(network),
            opts   = 'status=1, scrollbars=1'+',width='+width+',height='+height+',top='+top+',left='+left;

        window.open(url, 'share', opts);
    }

    /**
     * Add specified address to share emails.
     */
    public addEmail() {
        if (this.email.address) {
            this.email.addresses.push(this.email.address);
        }

        this.email.address = null;
    }

    /**
     * Remove specified address from share emails.
     */
    public removeEmail(address: string) {
        let i = this.email.addresses.findIndex(curr => curr === address);
        this.email.addresses.splice(i, 1);
    }

    /**
     * Copy fully qualified media item url to clipboard.
     */
    public copyLink() {
        copyToClipboard(this.link);
        this.toast.open('Copied link to clipboard.');
    }

    /**
     * Get specified share image url.
     */
    public getShareImage(name: string): string {
        return this.settings.getAssetUrl('images/social-icons/'+name+'.png');
    }

    /**
     * Select media item link on input click.
     */
    public selectLink(e) {
        e.target.setSelectionRange(0, this.link.length);
    }

    /**
     * Get absolute url to media item.
     */
    private getLink(encode = false): string {
        if ( ! this.type) return;
        let url = this.urls.routerLinkToUrl(this.urls[this.type as any](this.mediaItem));
        url = url.replace(/ /g, '+');
        return encode ? encodeURIComponent(url): url;
    }

    /**
     * Set type for current media item.
     */
    private setType(name: string): mediaItemType {
        let type = name;

        if (name === 'playlist-track') {
            type = 'track';
        }

        return type as mediaItemType;
    }

    /**
     * Get specified social network share url.
     */
    private getSocialMediaUrl(type: string) {
        switch(type) {
            case 'facebook':
                return 'https://www.facebook.com/sharer/sharer.php?u='+this.getLink(true);
            case 'twitter':
                return 'https://twitter.com/intent/tweet?text='+this.getLink(true);
            case 'google-plus':
                return 'https://plus.google.com/share?url='+this.getLink(true);
            case 'pinterest':
                return 'https://pinterest.com/pin/create/button/?url='+this.getLink(true)+'&media='+this.getImage();
            case 'tumblr':
                let base = 'https://www.tumblr.com/widgets/share/tool?shareSource=legacy&canonicalUrl=&posttype=photo&title=&caption=';
                return base+this.mediaItem.name+'&content='+this.getImage()+'&url='+this.getLink(true);
            case 'stumbleupon':
                return 'http://www.stumbleupon.com/submit?url='+this.getLink(true);
            case 'blogger':
                return 'https://www.blogger.com/blog_this.pyra?t&u='+this.getLink(true)+'&n='+this.mediaItem.name;
        }
    }

    /**
     * Get image for media item.
     */
    private getImage() {
        switch(this.type) {
            case 'artist':
                return (this.mediaItem as Artist).image_small;
            case 'album':
                return (this.mediaItem as Album).image;
            case 'track':
                return (this.mediaItem as Track).album.image;
            case 'playlist':
                return (this.mediaItem as Playlist).image;
        }
    }
}
