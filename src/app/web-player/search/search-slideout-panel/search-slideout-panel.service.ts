import {catchError, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Search} from "../search.service";
import {User} from "vebto-client/core/types/models/User";
import {Playlist} from "../../../models/Playlist";
import {Track} from "../../../models/Track";
import {Artist} from "../../../models/Artist";
import {Album} from "../../../models/Album";
import {of as observableOf} from "rxjs";
import {Router} from "@angular/router";

@Injectable()
export class SearchSlideoutPanel {

    /**
     * Whether last search request returned any results.
     */
    public noResults = false;

    /**
     * Whether search in currently in progress.
     */
    public searching = false;

    /**
     * Whether search panel is currently open.
     */
    public isOpen = false;

    /**
     * Input for search query.
     */
    public searchQuery = new FormControl();

    /**
     * Results returned by last search request.
     */
    public results;

    /**
     * SearchSlideoutPanel Service Constructor.
     */
    constructor(private search: Search, private router: Router) {
        this.bindToSearchQuery();
        this.results = this.getEmptyResultSet();
    }

    /**
     * Close search panel.
     */
    public close() {
        this.searchQuery.reset();
        this.isOpen = false;
        this.results = this.getEmptyResultSet();
    }

    /**
     * Open search panel.
     */
    public open() {
        this.isOpen = true;
    }

    public clearInput() {
        this.searchQuery.reset();
    }

    /**
     * Navigate to search page.
     */
    public goToSearchPage() {
        if ( ! this.searchQuery.value) return;
        this.router.navigate(['/search', this.searchQuery.value]);
    }

    /**
     * Perform a search when user types into search input.
     */
    private bindToSearchQuery() {
        this.searchQuery.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(query => {
                this.searching = true;
                if ( ! query) return observableOf(this.getEmptyResultSet());
                return this.search.everything(query, {limit: 5}).pipe(catchError(() => {
                    this.searching = false;
                    return observableOf(this.getEmptyResultSet());
                }));
            })).subscribe(response => {
                this.results = response;
                this.noResults = !this.responseHasResults(response);
                this.searching = false;
                if (this.searchQuery.value) this.open();
            });
    }

    /**
     * Check if search matched any records.
     */
    private responseHasResults(response: Object): boolean {
        for (let key in response) {
            if (response[key].length) return true;
        }
    }

    /**
     * Return empty result set for search response.
     */
    private getEmptyResultSet() {
        return {
            albums: <Album[]>[],
            artists: <Artist[]>[],
            tracks: <Track[]>[],
            playlists: <Playlist[]>[],
            users: <User[]>[],
        };
    }
}
