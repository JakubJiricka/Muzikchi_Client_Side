import {Injectable} from '@angular/core';
import {AppHttpClient} from "vebto-client/core/http/app-http-client.service";
import {Observable} from "rxjs";
import {Track} from "../../models/Track";

@Injectable()
export class Tracks {

    constructor(private http: AppHttpClient) {}

    /**
     * Get track by specified id.
     */
    public get(id: number): Observable<Track> {
        return this.http.get(`tracks/${id}`);
    }

    /**
     * Get top 50 tracks.
     */
    public getTop(): Observable<Track[]> {
        return this.http.get('tracks/top');
    }

    /**
     * Get latest tracks.
     */
    public getLatest(): Observable<Track[]> {
        return this.http.get('tracks/latest');
    }

    /**
     * Get radio recommendations for specified track.
     */
    public getRadioRecommendations(id: number) {
        return this.http.get(`radio/track/${id}`);
    }

    /**
     * Create a new track.
     */
    public create(payload: object): Observable<Track> {
        return this.http.post('tracks', payload);
    }

    /**
     * Update existing track.
     */
    public update(id: number, payload: object): Observable<Track> {
        return this.http.put('tracks/'+id, payload);
    }

    /**
     * Delete specified tracks.
     */
    public delete(ids: number[]) {
        return this.http.delete('tracks', {ids});
    }

    /**
     * Increment specified track plays.
     */
    public incrementPlays(track: Track) {
        return this.http.post(`tracks/${track.id}/plays/increment`);
    }

    /**
     * Create a new score.
     */
    public createScore(payload: object): Observable<Track> {
        return this.http.post('tracksScore', payload);
    }
}
