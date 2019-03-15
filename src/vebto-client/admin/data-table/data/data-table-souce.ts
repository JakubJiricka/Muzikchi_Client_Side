import {FormControl} from '@angular/forms';
import {DataSource, SelectionModel} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {DataTableSourceConfig} from './data-table-source-config';

export class DataTableSource<T> implements DataSource<T> {

    /**
     * Data for admin table to render.
     */
    protected data = new BehaviorSubject<T[]>(null);

    /**
     * Control for admin table search filter input field.
     */
    public searchQuery = new FormControl();

    /**
     * Model that stores and controls currently selected table rows.
     */
    public selectedRows = new SelectionModel<T>(true, []);

    /**
     * Data after it has been filtered by search query.
     */
    protected filteredData: T[] = [];

    /**
     * PaginatedDataTableSource Constructor.
     */
    constructor(protected config: DataTableSourceConfig<T>) {}

    public init(params?: object) {
        this.setFilteredData(this.config.initialData);

        this.searchQuery.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe(query => {
                this.setFilteredData(this.config.initialData.filter(item => {
                    return item['name'].toLowerCase().indexOf(query.toLowerCase()) > -1;
                }));
            });

        if (this.config.matSort) {
            this.config.matSort.sortChange.subscribe(sort => {
                // reset to original order
                if ( ! sort.direction) {
                    return this.data.next(this.filteredData);
                }

                const sortedData = this.filteredData.slice().sort((a, b) => {
                    if (a[sort.active] < b[sort.active])
                        return -1;
                    if (a[sort.active] > b[sort.active])
                        return 1;
                    return 0;
                });

                if (sort.direction === 'desc') {
                    sortedData.reverse();
                }

                this.data.next(sortedData);
            });
        }
    }

    /**
     * Refresh the data source by clearing sort and filters.
     */
    public refresh(params?: object) {
        this.searchQuery.reset();
        this.resetSort();
        this.selectedRows.clear();
        this.setFilteredData(this.config.initialData);
    }

    public resetSort() {
        if ( ! this.config.matSort) return;
        this.config.matSort.sort({id: '', start: 'asc', disableClear: false});
    }

    public setData(data: T[]) {
        this.config.initialData = data;
        this.setFilteredData(this.config.initialData);
    }

    protected setFilteredData(data: T[]) {
        this.filteredData = data.slice();
        this.data.next(this.filteredData);
    }

    /**
     * Check if data source does NOT have any results.
     * Will return false if paginator was not initiated yet.
     */
    public isEmpty(): boolean {
        return !this.filteredData.length;
    }

    /**
     * Check if all table rows are selected.
     */
    public allRowsSelected(): boolean {
        return this.selectedRows.selected.length &&
            this.selectedRows.selected.length === this.filteredData.length;
    }

    /**
     * Check if any rows are selected inside the table.
     */
    public anyRowsSelected() {
        return this.selectedRows.hasValue();
    }

    /**
     * Deselect all items in data source.
     */
    public deselectAllItems() {
        this.selectedRows.clear();
    }

    /**
     * Get IDs of all items selected inside data source.
     */
    public getSelectedItems(): number[] {
        return this.selectedRows.selected.map(item => item['id']);
    }

    /**
     * Selects all rows if they are not all selected. Otherwise clear selected rows.
     */
    public masterToggle() {
        this.allRowsSelected() ?
            this.selectedRows.clear() :
            this.filteredData.forEach(row => this.selectedRows.select(row));
    }

    public connect(): Observable<T[]> {
        return this.data;
    }

    public disconnect() {
        this.data.complete();
    }
}
