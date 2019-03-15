import {Injectable} from '@angular/core';
import {AppHttpClient} from "vebto-client/core/http/app-http-client.service";
import {Observable} from "rxjs";
import {Genre} from "../../models/Genre";
import {Artist} from "../../models/Artist";
import {PaginationResponse} from "vebto-client/core/types/pagination-response";

@Injectable()
export class Genres {

    /**
     * Genres Service Constructor.
     */
    constructor(private httpClient: AppHttpClient) {}

    /**
     * Get popular genres.
     */
    public getPopular(): Observable<Genre[]> {
        return this.httpClient.get('genres/popular');
    }

    /**
     * Get artists for specified genre.
     */
    public getGenreArtists(name: string, params = {}): Observable<{artistsPagination: PaginationResponse<Artist>, model: Genre}> {
        return this.httpClient.get(`genres/${name}/artists`, params);
    }
}
