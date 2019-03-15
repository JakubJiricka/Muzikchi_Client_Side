import {Injectable} from '@angular/core';
import {AppHttpClient} from "vebto-client/core/http/app-http-client.service";
import {Observable} from "rxjs";
import {SearchResponse} from "./search-response";

@Injectable()
export class Search {

    /**
     * Search Service Constructor.
     */
    constructor(private http: AppHttpClient) {}

    /**
     * Search for artists, albums, tracks, playlists and users.
     */
    public everything(query: string, params?: {limit: number}): Observable<SearchResponse> {
        return this.http.get('search/'+encodeURIComponent(query), params);
    }

    /**
     * Search for video ID for specified artist and track.
     */
    public videoId(artists: string, track: string): Observable<{title: string, id: string}[]> {
        const artistName = this.encode(artists),
              trackName  = this.encode(track);

        return this.http.get('search/audio/'+artistName+'/'+trackName);
    }

    /**
     * Search local database for matching artists.
     */
    public localArtists(query: string, params?: {limit: number}) {
        return this.http.get('search/local/artists/'+query, params);
    }

    private encode(string: string): string {
        return encodeURIComponent(string.replace('/', '+'));
    }
    /*
    *set langauge
     */
    public chnageLanguage(language: string) {
        return this.http.get('search/lang/'+language, {});
    }
    /*
    clear cache for search
     */
    public clearCache(){
        return this.http.get('search/cache/clear', {});
    }

}
