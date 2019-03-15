import {Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subscription, combineLatest, BehaviorSubject} from "rxjs";
import {Paginator} from "./paginator.service";
import {delay} from "rxjs/operators";
import {snakeCase} from '../../core/utils/snake-case';
import {AdminModule} from "../admin.module";

@Injectable({
    providedIn: AdminModule,
})
export class UrlAwarePaginator extends Paginator {

    /**
     * Router query params subscription.
     */
    private subscription: Subscription;

    /**
     * Observable used to refresh paginator manually
     * when route params or query params have not changed.
     */
    protected onRefresh = new BehaviorSubject({});

    /**
     * Router instance.
     */
    private router: Router;

    /**
     * UrlAwarePaginator Constructor.
     */
    constructor(protected injector: Injector) {
        super(injector);
        this.router = this.injector.get(Router);
    }

    /**
     * Start pagination.
     */
    public paginate(url: string, options: Object = {}): Observable<any> {
        this.destroy();
        this.serverUri = url;

        //we need to delay query params observable slightly so that
        //route params are fired before query params which gives
        //components a chance to destroy paginator and avoid
        //double requests if query and route params change at the same time
        return new Observable(observer => {
            this.subscription = combineLatest(
                this.router.routerState.root.queryParams.pipe(delay(10)),
                this.onRefresh,
                (params1, params2) => Object.assign({}, options, params1, params2)
            ).subscribe(merged => {
                this.makeRequest(merged).subscribe(response => observer.next(response));
            });
        });
    }

    /**
     * Refresh paginator with specified params.
     */
    public refresh(params = {}): Observable<any> {
        this.onRefresh.next(params);
        return this.serverRequest;
    }

    /**
     * Go to specified page.
     */
    protected goToPage(page: number) {
        this.updateQueryParams({page});
    }

    /**
     * Fired when any of router parameters are changed by user (via pagination controls).
     */
    public onParamChange(name: string) {
        let params = {};
        params[snakeCase(name)] = this.params[name];
        this.updateQueryParams(params);
    }

    /**
     * Update query params of currently active url.
     */
    public updateQueryParams(params = {}) {
        let merged = Object.assign({}, this.router.routerState.snapshot.root.queryParams, params);
        this.router.navigate([], {queryParams: this.normalizeParams(merged)});
    }
    
    /**
     * Remove all observables and unsubscribe from route params.
     */
    public destroy() {
        this.subscription && this.subscription.unsubscribe();
        super.destroy();
    }
}