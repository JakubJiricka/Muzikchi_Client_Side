import {of as observableOf, Observable, Subscription} from 'rxjs';
import {catchError, switchMap, distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {FormControl} from "@angular/forms";
import {ElementRef, OnDestroy, ViewChild} from "@angular/core";
import * as Dot from "dot-object";

export class FilterablePage<T> implements OnDestroy {
    @ViewChild('scrollContainer') scrollContainer: ElementRef;

    /**
     * Active subscriptions.
     */
    private subscriptions: Subscription[] = [];

    public order: string;

    /**
     * List of filtered items.
     */
    public filteredItems: T[] = [];

    /**
     * List of original items.
     */
    protected originalItems: T[] = [];

    /*
     * Query for filtering items.
     */
    public filterQuery = new FormControl();

    /**
     * FilterablePage Constructor.
     */
    constructor(protected filterProps: string[] = []) {
        this.bindToFilterQuery();
    }

    /**
     * Set specified items as filterable and original items.
     */
    protected setItems(items: T[]) {
        if ( ! items) return;
        this.filteredItems = items.slice();
        this.originalItems = items.slice();
    }

    /**
     * Set specified items as filterable items.
     */
    protected setFilteredItems(items: T[]) {
        this.filteredItems = items.slice();
    }

    /**
     * Append specified items to current items.
     */
    protected appendItems(items: T[]) {
        this.filteredItems = this.filteredItems.concat(items.slice());
        this.originalItems = this.originalItems.concat(items.slice());
    }

    /**
     * Prepend specified items to current items.
     */
    protected prependItems(items: T[]) {
        this.filteredItems = items.slice().concat(this.filteredItems);
        this.originalItems = items.slice().concat(this.originalItems);
    }

    /**
     * Remove specified items.
     */
    protected removeItems(items: T[]|T) {
        if ( ! Array.isArray(items)) items = [items];

        items.forEach(item => {
            this.filteredItems.splice(this.filteredItems.findIndex(i => item['id'] === i['id']), 1);
            this.originalItems.splice(this.originalItems.findIndex(i => item['id'] === i['id']), 1);
        });
    }

    /**
     * Filter items by specified query.
     */
    protected filter(query: string): T[]|Observable<T[]> {
        return this.originalItems.filter(item => {
            const props = this.filterProps.map(prop => {
                return Dot.pick(prop, item);
            });

            return props.filter(prop => prop.indexOf(query) > -1).length > 0;
        });
    }

    /**
     * Sort items by specified object property.
     */
    public sort(prop: string, direction = 'asc', displayName?: string) {
        const order = displayName || prop;

        if (this.order === order) return;

        this.order = order;

        this.filteredItems.sort((a, b) => {
            if (Dot.pick(prop, a) < Dot.pick(prop, b)) {
                return -1;
            } else if (Dot.pick(prop, a) > Dot.pick(prop, b)) {
                return 1;
            } else {
                return 0;
            }
        });

        if (direction === 'desc') {
            this.filteredItems.reverse();
        }
    }

    /**
     * Filter items when user types into filter input.
     */
    protected bindToFilterQuery() {
        const sub = this.filterQuery.valueChanges.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            switchMap(query => {
                const filtered = query ? this.filter(query) : this.originalItems;
                return filtered instanceof Observable ? filtered : observableOf(filtered);
            }),catchError(() => {
                return observableOf([]);
            }),).subscribe(items => {
                this.setFilteredItems(items);
                this.triggerImagesLazyLoad();
            });

        this.subscriptions.push(sub);
    }

    /**
     * Manually trigger loading of lazy images on the page.
     */
    private triggerImagesLazyLoad() {
        if ( ! this.scrollContainer) return;
        let container = this.scrollContainer.nativeElement;
        container.scrollTop++;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });

        this.subscriptions = [];
    }
}
