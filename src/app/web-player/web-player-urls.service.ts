import {Injectable} from '@angular/core';
import {Album} from "../models/Album";
import {Artist} from "../models/Artist";
import {Genre} from "../models/Genre";
import {Track} from "../models/Track";
import {Playlist} from "../models/Playlist";
import {Settings} from "vebto-client/core/config/settings.service";
import {User} from "vebto-client/core/types/models/User";

@Injectable()
export class WebPlayerUrls {

    constructor(private settings: Settings) {}

    /**
     * Get router link for specified album.
     */
    public album(album: Album, artist?: Artist|string) {
        if ( ! artist) artist = album.artist;

        if (artist) {
            artist = typeof artist === 'string' ? artist : artist.name;
        } else {
            artist = 'Various Artists';
        }

        return ['/album', album.id, this.encodeItemName(artist), this.encodeItemName(album.name)];
    }

    /**
     * Get router link for specified artist.
     */
    public artist(artist: Artist|string, append?: string) {
        let link = ['/artist'];

        if (typeof artist === 'string') {
            link.push(this.encodeItemName(artist));
        } else if (artist) {
            link = link.concat([artist.id, this.encodeItemName(artist.name)] as any);
        }

        if (append) link.push(append);

        return link;
    }

    /**
     * Get router link for specified artist radio.
     */
    public artistRadio(artist: Artist) {
        return ['radio/artist', artist.id, this.encodeItemName(artist.name)];
    }

    /**
     * Get router link for specified track radio.
     */
    public trackRadio(track: Track) {
        return ['radio/track', track.id, this.encodeItemName(track.name)];
    }

    /**
     * Get router link for specified genre.
     */
    public genre(genre: Genre) {
        return ['/genre', this.encodeItemName(genre.name)];
    }

    public track(track: Track) {
        return ['/track', track.id, this.encodeItemName(track.name)];
    }

    /**
     * Url for downloading a track.
     */
    public trackDownload(track: Track) {
        return this.settings.getBaseUrl(true)+'secure/tracks/'+track.id+'/download';
    }

    public playlist(playlist: Playlist) {
        return ['/playlists', playlist.id, this.encodeItemName(playlist.name)];
    }

    public user(user: User, append?: string) {
        if ( ! user) return ['/'];

        let link = ['/user', user.id, this.encodeItemName(user['display_name'])];

        if (append) link.push(append);

        return link;
    }

    public search(query: string, tab?: string) {
        const link = ['/search', this.encodeItemName(query)];
        if (tab) link.push(tab);
        return link;
    }

    /**
     * Get router link for editing specified artist.
     */
    public editArtist(artist: Artist): any[] {
        return ['admin/artists', artist.id, 'edit'];
    }

    public encodeItemName(name: string): string {
        if ( ! name) return '';
        return name.toLowerCase().replace(/%/g, '%25').replace(/\+/g, '%2B')
    }

    public routerLinkToUrl(commands: any[]): string {
        const baseUrl = this.settings.getBaseUrl().replace(/\/$/, '');
        return baseUrl + this.encodeItemName(commands.join('/'));
    }
}
