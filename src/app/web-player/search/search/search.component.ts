import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WebPlayerUrls} from "../../web-player-urls.service";
import {FormControl} from "@angular/forms";
import {of as observableOf} from "rxjs";
import {Search} from "../search.service";
import {WebPlayerState} from "../../web-player-state.service";
import {Settings} from "vebto-client/core/config/settings.service";
import {SearchResponse} from "../search-response";

@Component({
    selector: 'search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {

    public searchTerm: string;

    /**
     * Whether search is currently in progress.
     */
    public searching = false;

    /**
     * Whether search was already performed at least once.
     */
    public searchedOnce = false;

    /**
     * Currently active search page tab.
     */
    private activeTab: string = 'topResults';

    /**
     * Search input control.
     */
    public searchControl = new FormControl();

    /**
     * Search results.
     */
    public results: SearchResponse;

    public langFarsi = '' ;
    public lang ='farsi';

    /**
     * SearchComponent Constructor.
     */
    constructor(
        private route: ActivatedRoute,
        public urls: WebPlayerUrls,
        private search: Search,
        public state: WebPlayerState,
        public settings: Settings
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.results = data.results;
            console.log(this.results);
        });

        this.route.params.subscribe(params => {
            this.searchTerm = params.query;
            this.searchControl.setValue(this.searchTerm, {emitEvent: false});
            this.activeTab = params.tab || 'topResults';
            if (this.searchTerm) this.searchedOnce = true;
        });

        this.bindToSearchQuery();
        this.langFarsi = this.settings.getAssetUrl('images/search/mobile_farsi_off.png');
    }

    public activeTabIs(name: string) {
        return this.activeTab === name;
    }

    /**
     * Get router link for specified search tab.
     */
    public getRouterLink(tab?: string) {
        return this.urls.search(this.searchControl.value, tab);
    }

    /**
     * Check if any results have been found.
     */
    public hasResults(): boolean {
        if ( ! this.results || ! Object.keys(this.results)) return false;

        for (let type in this.results) {
            if (this.results[type].length) return true;
        }
    }

    /**
     * Check if there's a search term.
     */
    public hasSearchTerm() {
        return this.searchTerm || this.searchControl.value;
    }

    /**
     * Clear current search and input.
     */
    public clearSearch() {
        this.searchControl.setValue(null);
        this.searchTerm = null;
    }

    /**
     * Perform a search when user types into search input.
     */
    private bindToSearchQuery() {
        this.searchControl.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(query => {
                this.searching = true;
                if ( ! query) return observableOf(this.getEmptyResults());
                return this.search.everything(query, {limit: 20});
            })
        ).subscribe(response => {
            this.results = response || this.getEmptyResults();
            this.searching = false;
            this.searchedOnce = true;
        }, () => {
            return observableOf(this.getEmptyResults());
        });
    }

    /**
     * Get empty search results set.
     */
    private getEmptyResults(): SearchResponse {
        return {
            artists: [],
            albums: [],
            tracks: [],
            playlists: [],
            users: [],
        }
    }

    /**
     * img display
     */
    public langChange() {
        if (this.lang === 'english') {
            this.langFarsi = this.settings.getAssetUrl('images/search/mobile_farsi_on.png');
            this.lang = 'farsi';
        } else if (this.lang === 'farsi') {
            this.langFarsi = this.settings.getAssetUrl('images/search/mobile_farsi_off.png');
            this.lang = 'english';
        }
        this.search.clearCache().subscribe(response=>{});
        this.search.chnageLanguage(this.lang).subscribe(response=>{});
    }
}
