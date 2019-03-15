import {Injectable} from "@angular/core";
import {Settings} from "vebto-client/core/config/settings.service";
import {Playlist} from '../models/Playlist';
import {Album} from '../models/Album';
import {Track} from '../models/Track';

@Injectable({
    providedIn: 'root',
})
export class WebPlayerImagesService {

    constructor(private settings: Settings) {}

    /**
     * Get default image url for artist or album.
     */
    public getDefault(type: 'artist'|'album'|'artistBig'): string {
        if (type === 'artist') {
            return this.settings.getAssetUrl('images/default/artist_small.jpg');
        } else if (type === 'artistBig') {
            return this.settings.getAssetUrl('images/default/artist-big.jpg');
        } else {
            return this.settings.getAssetUrl('images/default/album.png');
        }
    }

    /**
     * Get image for specified playlist.
     */
    public getPlaylistImage(playlist: Playlist): string {
        if (playlist.image) return playlist.image;
        if (playlist.tracks && playlist.tracks[0] &&  playlist.tracks[0].album) return playlist.tracks[0].album.image;
        return this.getDefault('album');
    }

    public getGenreImage(genre: {name: string, image: string}) {
        return this.settings.getAssetUrl(genre.image);
    }

    /**
     * Get available album image url or default one.
     */
    public getAlbumImage(album: Album): string {
        if (album && album.image) return album.image;
        return this.getDefault('album');
    }

    /**
     * Get image for specified track.
     */
    public getTrackImage(track: Track) {
        if ( ! track || ! track.album) return this.getDefault('album');
        return track.track_image;
    }
}
