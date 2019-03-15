import {finalize, map} from 'rxjs/operators';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Artist} from "../../../models/Artist";
import {Genre} from "../../../models/Genre";
import {FilterablePage} from "../../filterable-page/filterable-page";
import {PaginationResponse} from "vebto-client/core/types/pagination-response";
import {Genres} from "../genres.service";
import {Settings} from "vebto-client/core/config/settings.service";

@Component({
    selector: 'genre',
    templateUrl: './genre.component.html',
    styleUrls: ['./genre.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GenreComponent extends FilterablePage<Artist> implements OnInit {

    /**
     * Pagination for artists.
     */
    public pagination: PaginationResponse<Artist>;

    /**
     * Genre model.
     */
    public genre: Genre = new Genre();

    /**
     * Whether more artists are being loaded currently.
     */
    public loading = false;

    /**
     * GenreComponent Constructor.
     */
    constructor(
        private route: ActivatedRoute,
        private genres: Genres,
        public settings: Settings,
    ) {
        super();
    }

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.pagination = data.genreData.artistsPagination;
            this.setItems(this.pagination.data);
            this.genre = data.genreData.genre;
        });
    }

    /**
     * Filter genre artists by specified query.
     */
    protected filter(query: string) {
        return this.genres.getGenreArtists(this.genre.name, {query})
            .pipe(map(response => response.artistsPagination.data));
    }

    /**
     * Load more artists for current genre.
     */
    public loadMore() {
        this.loading = true;
        let params = {page: this.pagination.current_page + 1};

        this.genres.getGenreArtists(this.genre.name, params).pipe(finalize(() => {
            this.loading = false;
        })).subscribe(response => {
            this.pagination = response.artistsPagination;
            this.appendItems(this.pagination.data);
        });
    }

    /**
     * Check if more artists can be loaded for current genre.
     */
    public canLoadMore() {
        return ! this.loading && ! this.filterQuery.value && this.pagination.current_page < this.pagination.last_page;
    }
}
