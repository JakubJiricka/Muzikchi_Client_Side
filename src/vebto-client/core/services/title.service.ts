import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {Translations} from "../translations/translations.service";
import {Settings} from "../config/settings.service";
import {filter, map, mergeMap} from "rxjs/operators";
import {CoreModule} from '../core.module';

@Injectable({
    providedIn: CoreModule,
})
export class TitleService {

    /**
     * Data of currently active route.
     */
    private routeData: object;

    /**
     * TitleService Constructor.
     */
    constructor(
        private router: Router,
        private title: Title,
        private i18n: Translations,
        private settings: Settings,
    ) {}

    /**
     * Init title service.
     */
    public init() {
        this.bindToRouterEvents();
    }

    /**
     * Get page title for specified route.
     */
    private getTitle(data): string {
        switch (data.name) {
            case 'account-settings':
                return this.i18n.t('Account Settings');
            case 'user':
                return data.user.display_name;
            case 'search':
                return this.i18n.t('Search');
            default:
                return this.getDefaultTitle();
        }
    }

    /**
     * Get default page title.
     */
    private getDefaultTitle() {
        return this.settings.get('branding.site_name');
    }

    /**
     * Change page title on route change.
     */
    private bindToRouterEvents() {
        this.router.events
            .pipe(
                filter(e => e instanceof NavigationEnd),
                map(() => {
                    let route = this.router.routerState.root;
                    while (route.firstChild) route = route.firstChild;
                    return route;
                }),
                filter(route => route.outlet === 'primary'),
                mergeMap(route => route.data)
            )
            .subscribe(data => {
                this.routeData = data;
                this.title.setTitle(this.getTitle(data))
            });
    }
}
