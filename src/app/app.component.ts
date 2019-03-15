import {filter} from 'rxjs/operators';
import {
    Component,
    ElementRef,
    NgZone,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import * as svg4everybody from 'svg4everybody';
import {NavigationEnd, Router} from "@angular/router";
import {PopularGenresResolver} from "./web-player/genres/popular-genres/popular-genres-resolver.service";
import {PopularGenresComponent} from "./web-player/genres/popular-genres/popular-genres.component";
import {NewReleasesPageComponent} from "./web-player/albums/new-releases-page/new-releases-page.component";
import {PopularAlbumsComponent} from "./web-player/albums/popular-albums/popular-albums.component";
import {PopularAlbumsResolver} from "./web-player/albums/popular-albums/popular-albums-resolver.service";
import {TopTracksPageResolver} from "./web-player/tracks/top-tracks-page/top-tracks-page-resolver.service";
import {NewReleasesPageResolver} from "./web-player/albums/new-releases-page/new-releases-page.resolver.service";
import {TopTracksPageComponent} from "./web-player/tracks/top-tracks-page/top-tracks-page.component";
import {BrowserEvents} from "vebto-client/core/services/browser-events.service";
import {AppHttpClient} from "vebto-client/core/http/app-http-client.service";
import {CustomHomepage} from "vebto-client/core/pages/custom-homepage.service";
import {Settings} from "vebto-client/core/config/settings.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    @ViewChild('contextMenuPlaceholder', {read: ViewContainerRef}) contextMenuPlaceholderRef;
    @ViewChild('appContent') appContentEl: ElementRef;

    constructor(
        private browserEvents: BrowserEvents,
        private el: ElementRef,
        private http: AppHttpClient,
        private settings: Settings,
        private router: Router,
        private customHomepage: CustomHomepage,
        private zone: NgZone,
    ) {}

    ngOnInit() {
        this.browserEvents.subscribeToEvents(this.el.nativeElement);
        this.settings.setHttpClient(this.http);

        //google analytics
        if (this.settings.get('analytics.tracking_code')) {
            this.triggerAnalyticsPageView();
        }

        //svg icons polyfill
        svg4everybody();

        this.setInjectorOnAppearanceEditorIframe();

        //custom homepage
        this.customHomepage.select([
            {path: 'popular-genres', component: PopularGenresComponent, resolve: {genres: PopularGenresResolver}, data: {name: 'home'}},
            {path: 'popular-albums', component: PopularAlbumsComponent, resolve: {albums: PopularAlbumsResolver}, data: {name: 'popular-albums'}},
            {path: 'new-releases', component: NewReleasesPageComponent, resolve: {albums: NewReleasesPageResolver}, data: {name: 'new-releases'}},
            {path: 'top-50', component: TopTracksPageComponent, resolve: {tracks: TopTracksPageResolver}, data: {name: 'top-50'}},
        ]);
    }

    private setInjectorOnAppearanceEditorIframe() {
        if (window.location.search.indexOf('token='+this.settings.csrfToken) > -1) {
            window['previewAngular'] = {settings: this.settings, router: this.router, zone: this.zone};
        }
    }

    private triggerAnalyticsPageView() {
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if ( ! window['ga']) return;
                window['ga']('set', 'page', event.urlAfterRedirects);
                window['ga']('send', 'pageview');
            });
    }
}
