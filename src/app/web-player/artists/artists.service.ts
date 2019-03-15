import {Injectable} from '@angular/core';
import {AppHttpClient} from "vebto-client/core/http/app-http-client.service";
import {Observable} from "rxjs";
import {Artist} from "../../models/Artist";
import {Album} from "../../models/Album";
import {Track} from "../../models/Track";
import {PaginationResponse} from "vebto-client/core/types/pagination-response";

@Injectable()
export class Artists {

    /**
     * Artists Service Constructor.
     */
    constructor(private httpClient: AppHttpClient) {}

    /**
     * Get artist matching specified id.
     */
    public get(id: number, params = {}): Observable<{artist: Artist, albums: PaginationResponse<Album>, top_tracks?: Track[]}> {
        return this.httpClient.get('artists/' + id, params);
    }

    /**
     * Create a new artist.
     */
    public create(payload: object): Observable<Artist> {
        return this.httpClient.post('artists', payload);
    }

    /**
     * Update existing artist.
     */
    public update(id: number, payload: object): Observable<Artist> {
        return this.httpClient.put('artists/'+id, payload);
    }

    /**
     * Paginate specified artist albums.
     */
    public paginateArtistAlbums(id: number, page = 1): Observable<PaginationResponse<Album>> {
        return this.httpClient.get('artists/'+id+'/albums', {page});
    }

    /**
     * Get radio recommendations for specified artist.
     */
    public getRadioRecommendations(id: number) {
        return this.httpClient.get(`radio/artist/${id}`);
    }

    /**
     * Delete specified artists.
     */
    public delete(ids: number[]) {
        return this.httpClient.delete('artists', {ids});
    }
}
